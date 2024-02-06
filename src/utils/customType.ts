import { City, County, Prisma, Provider, State, ZipCode } from '@prisma/client';

type ProviderWithoutRelationalData = Omit<
  Provider,
  'stateId' | 'countyId' | 'cityId' | 'zipCodeId' | 'createdAt' | 'updatedAt'
>;

type TypeFromJoins = {
  state: Pick<State, 'name'>;
  county: Pick<County, 'name'>;
  city: Pick<City, 'name'>;
  zipCode: Pick<ZipCode, 'code'>;
};

export type CustomProviderAPIResponse = ProviderWithoutRelationalData & TypeFromJoins;

// export type scraperResponse = Omit<CustomProviderAPIResponse, 'id'>;
export type scraperResponse = {
  scrapingId: string;
  name: string;
  state: string;
  address: string;
  city: string;
  zipCode: string;
  county: string;
  type: string;
  capacity: string;
  phone: string;
  mapUrl: string;
};

export type OperationResult = {
  success: boolean;
  id?: number;
  name?: string;
  reason?: string;
};
