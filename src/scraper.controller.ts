// scraper.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('/:stateName/:searchTerm')
  async initiateScrape(@Param('stateName') stateName: string, @Param('searchTerm') searchTerm: string) {
    try {
      const res = await this.scraperService.scrapeTexasLTCSearch((stateName = 'texas'), searchTerm);

      // Handle orchastration here
      // const cleanData = await this.transformData(providersData)
      // await this.saveToDatabase(cleanData);
      // this.sendNotification('Scraping completed')
      // console.log(providersData);

      return res;
    } catch (error) {
      console.error('Error scraping data:', error);
      return { error: 'Error scraping data' };
    }
  }
}
