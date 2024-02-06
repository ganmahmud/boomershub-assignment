import { Injectable, OnModuleInit } from '@nestjs/common';
import { City, County, PrismaClient, Provider, State, ZipCode } from '@prisma/client';
import { getStateAbbreviation } from './utils/schem-util';
import { CustomProviderAPIResponse, OperationResult, scraperResponse } from './utils/customType';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', async e => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(`${e.query} ${e.params}`);
    });
  }

  private async getOrCreateState(stateName: string): Promise<State> {
    // Check if state already exists
    const existingState = (await this.state.findFirst({
      where: {
        name: stateName,
      },
      select: {
        id: true,
      },
    })) as State;

    if (existingState) {
      return existingState;
    }

    // If state doesn't exist, create a new one
    const newState = await this.state.create({
      data: {
        name: stateName,
        abbreviation: getStateAbbreviation(stateName),
      },
    });

    return { id: newState.id } as State;
  }

  async getOrCreateCounty(countyName: string, stateId: number): Promise<County> {
    // Check if county already exists
    const existingCounty = await this.county.findFirst({
      where: {
        name: countyName,
      },
      select: {
        id: true,
      },
    });

    if (existingCounty) {
      return existingCounty as County;
    }

    // If county doesn't exist, create a new one
    const newCounty = await this.county.create({
      data: {
        name: countyName,
        stateId: stateId,
      },
    });

    return { id: newCounty.id } as County;
  }

  async getOrCreateCity(cityName: string, countyId: number): Promise<City> {
    // Check if city already exists
    const existingCity = await this.city.findFirst({
      where: {
        name: cityName,
      },
      select: {
        id: true,
      },
    });

    if (existingCity) {
      return existingCity as City;
    }

    // If city doesn't exist, create a new one
    const newCity = await this.city.create({
      data: {
        name: cityName,
        countyId: countyId,
      },
    });

    return { id: newCity.id } as City;
  }

  async getOrCreateZipCode(zipCode: string, cityId: number): Promise<ZipCode> {
    // Check if zip code already exists
    const existingZipCode = await this.zipCode.findFirst({
      where: {
        code: zipCode,
      },
      select: {
        id: true,
      },
    });

    if (existingZipCode) {
      return { id: existingZipCode.id } as ZipCode;
    }

    // If zip code doesn't exist, create a new one
    const newZipCode = await this.zipCode.create({
      data: {
        code: zipCode,
        cityId: cityId,
      },
    });

    return { id: newZipCode.id } as ZipCode;
  }

  async sendDataToDb(providerDataArray: scraperResponse[]): Promise<OperationResult[]> {
    try {
      const providerCreatePromises: Promise<OperationResult>[] = [];

      for (const providerData of providerDataArray) {
        providerCreatePromises.push(this.createOrUpdateProvider(providerData));
      }

      const results = await Promise.all(providerCreatePromises);

      console.log('Data save into the database:', results);

      return results;
    } catch (error) {
      console.error('Error transforming and saving data:', error);
    } finally {
      await this.$disconnect();
    }
  }

  private async createOrUpdateProvider(providerData: scraperResponse): Promise<OperationResult> {
    try {
      const { name, address, city, zipCode, county, state, type, capacity, phone, mapUrl } = providerData;
      console.log(`Preparing ${name} data`);

      const existingProvider: Provider = await this.provider.findUnique({
        where: {
          name_address: {
            name: name,
            address,
          },
        },
      });

      if (existingProvider) {
        const reason = `Provider ${name} already exists. Skipping insertion.`;
        console.log(reason);
        return { success: false, id: existingProvider.id, name: existingProvider.name, reason };
      }

      // state
      const { id: stateId } = await this.getOrCreateState(state);

      // county
      const { id: counyId } = await this.getOrCreateCounty(county, stateId);
      // city
      const { id: cityId } = await this.getOrCreateCity(city, counyId);
      // zip
      const { id: zipCodeId } = await this.getOrCreateZipCode(zipCode, cityId);

      const createdProvider = await this.provider.create({
        data: {
          name,
          address,
          type,
          capacity: capacity ? parseInt(capacity) : null,
          phone,
          mapUrl,
          state: { connect: { id: stateId } },
          county: { connect: { id: counyId } },
          city: { connect: { id: cityId } },
          zipCode: { connect: { id: zipCodeId } },
        },
        select: {
          id: true,
          name: true,
        },
      });

      console.log(`Provider ${name} inserted successfully.`);
      return { success: true, id: createdProvider.id, name: createdProvider.name };
    } catch (error) {
      console.error('Error creating or updating provider:', error);
    }
  }
}
