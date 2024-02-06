// app.service.ts

import { Injectable } from '@nestjs/common';
import { Provider as ProvideModel, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { CustomProviderAPIResponse } from './utils/customType';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFilteredProviders(
    searchString: string,
    take?: number,
    skip?: number,
  ): Promise<CustomProviderAPIResponse[]> {
    const conditions: Prisma.ProviderWhereInput = {};

    if (searchString) {
      conditions.OR = [
        { name: { contains: searchString } },
        { type: { contains: searchString } },
        { state: { name: { equals: searchString } } },
        { county: { name: { equals: searchString } } },
        { city: { name: { equals: searchString } } },
        { zipCode: { code: { equals: searchString } } },
        // Add more fields as needed, e.g., { type: { contains: searchString } }
      ];
    }

    return this.prismaService.provider.findMany({
      where: conditions,
      take: Number(take) || 100,
      skip: Number(skip) || undefined,
      select: {
        id: true,
        scrapingId: true,
        mapUrl: true,
        name: true,
        address: true,
        phone: true,
        type: true,
        capacity: true,
        state: { select: { name: true } },
        county: { select: { name: true } },
        city: { select: { name: true } },
        zipCode: { select: { code: true } },
      },
    });
  }
}
