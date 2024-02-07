import { PrismaClient, State, County, City, ZipCode, Provider } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding data for Texas...');

    // Create State
    const texas: State = await prisma.state.create({
      data: {
        name: 'Texas',
        abbreviation: 'TX',
      },
    });
    console.log('State created:', texas);

    // Create Counties
    const harrisCounty: County = await prisma.county.create({
      data: {
        name: 'Harris',
        stateId: texas.id,
      },
    });
    console.log('County created:', harrisCounty);

    // Create Cities
    const houstonCity: City = await prisma.city.create({
      data: {
        name: 'Houston',
        countyId: harrisCounty.id,
      },
    });
    console.log('City created:', houstonCity);

    // Create Zip Codes
    const zipCode77001: ZipCode = await prisma.zipCode.create({
      data: {
        code: '77001',
        cityId: houstonCity.id,
      },
    });
    console.log('Zip Code created:', zipCode77001);

    // Generate random scraping ID
    const scrapingId = Math.random().toString(36).substring(7);

    // Generate random map URL
    const mapUrl = 'https://www.google.com/maps/place/359+VILLAGE+COMMONS+BOULEVARD,+Georgetown,+TX+78633';

    // Create Providers
    const providers = await prisma.provider.createMany({
      data: [
        {
          name: 'Example Provider 1',
          address: '123 Main St',
          phone: '123-456-7890',
          type: 'Assisted Living',
          capacity: 50,
          stateId: texas.id,
          countyId: harrisCounty.id,
          cityId: houstonCity.id,
          zipCodeId: zipCode77001.id,
          scrapingId,
          mapUrl,
        },
        // Add more providers as needed
      ],
    });

    console.log('Providers created:', providers);

    console.log('Data seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
