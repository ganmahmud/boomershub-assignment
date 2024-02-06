import { State } from '@prisma/client';
// scraper.service.ts
import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { PrismaService } from './prisma.service';

@Injectable()
export class ScraperService {
  constructor(private readonly prismaService: PrismaService) {}

  private async scrapeCapacity(page: Page) {
    return page.evaluate(() => {
      const liElements = document.querySelectorAll('li');
      for (const li of liElements) {
        if (li.textContent?.includes('Total Bed Count')) {
          const bedCountMatch = li.textContent.match(/\d+/);
          return bedCountMatch ? bedCountMatch[0] : null;
        }
      }
      return null; // Return null if not found
    });
  }

  private async scrapePhoneNumber(page: Page) {
    return page.evaluate(() => {
      const phoneIcon = document.querySelector('.fa-phone');
      return phoneIcon ? phoneIcon.nextSibling?.textContent?.trim() || null : null;
    });
  }

  private async scrapeMapUrl(page: Page) {
    return page.$eval('a[title="Get Map of this Location"]', (a: HTMLAnchorElement) => a.href);
  }

  private async scrapeComplimentaryData(url: string, browser: Browser) {
    const page = await browser.newPage();

    try {
      await page.goto(url);

      const [capacity, phone, mapUrl] = await Promise.all([
        this.scrapeCapacity(page),
        this.scrapePhoneNumber(page),
        this.scrapeMapUrl(page),
      ]);

      return {
        capacity,
        phone,
        mapUrl,
      };
    } finally {
      console.log('Done');
    }
  }

  async scrapeTexasLTCSearch(stateName: string, searchTerm: string): Promise<any> {
    const initialCheck = await fetch(`https://apps.hhs.texas.gov/LTCSearch/namelookup.cfm?term=${searchTerm}`);
    const initialCheckResponse: string[] = await initialCheck.json();
    if (initialCheckResponse.length === 0) {
      return {
        success: false,
        name: searchTerm,
        reason: 'Not found',
      };
    }

    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    try {
      // going to the page
      await page.goto('https://apps.hhs.texas.gov/LTCSearch/');

      // Clicking the Provider tab
      await page.click('.tp3last a');

      // Typing in the search string
      const searchInput = await page.$('#searchterm');
      await searchInput?.type(searchTerm);
      // Submitting the form
      await searchInput?.press('Enter');

      // Waiting for the page to load full
      await page.waitForSelector('.sortabletable', { visible: true });

      // Parsing the search list table
      const tableData = await page.evaluate(stateName => {
        const tableRows = document.querySelectorAll('.sortabletable tbody tr');
        const headers = Array.from(document.querySelectorAll('.sortabletable thead th')).map(
          th => th.textContent?.trim().toLowerCase(),
        ); // Get column headers

        const providersData: Record<string, any> = {};

        const foundProviders: string[] = [];

        if (tableRows.length > 0 && headers.length > 0) {
          for (const row of tableRows) {
            const cells = row.querySelectorAll('td');

            const providerURL = cells[0].querySelector('a')?.href as string;

            foundProviders.push(providerURL);

            const { searchParams: providerParams } = new URL(providerURL);

            const providerId = providerParams.get('pid') || '';

            const providerData: Record<string, string> = {};

            for (let index = 0; index < cells.length; index++) {
              let header = headers[index]
                ?.replace(/\b\w/g, (match, index) => (index === 0 ? match.toLowerCase() : match.toUpperCase()))
                .replace(/\s+/g, '');
              const cellContent = cells[index].textContent?.trim();
              if (header !== undefined && cellContent !== undefined) {
                if (header === 'provider') {
                  header = 'name';
                }
                providerData[header] = cellContent;
                providerData['state'] = stateName;
              }
            }

            if (providerId !== undefined) {
              providersData[providerId] = providerData;
            }
          }
        }

        return { providersData, urlList: foundProviders };
      }, stateName);

      const allData = tableData.providersData;

      const providerDataArray = await Promise.all(
        tableData.urlList.map(async url => {
          const providerId = new URL(url).searchParams.get('pid') || '';
          if (allData[providerId]) {
            return {
              [providerId]: await this.scrapeComplimentaryData(url, browser),
            };
          }
        }),
      );

      providerDataArray.forEach((entry: any) => {
        const key = Object.keys(entry)[0];
        if (allData[key]) {
          allData[key] = { scrapingId: key, ...allData[key], ...entry[key] };
        }
      });

      const providersData = Object.values(allData);

      console.log('Scraping Done. Initiating Orchastration..');

      return await this.prismaService.sendDataToDb(providersData);
    } finally {
      await browser.close();
    }
  }
}
