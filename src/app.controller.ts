import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { Provider as ProviderModel, Prisma, Provider } from '@prisma/client';
import { AppService } from './app.service';
import { CustomProviderAPIResponse } from './utils/customType';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['', 'providers'])
  async getFilteredProviders(
    @Query('search') searchString?: string,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ): Promise<CustomProviderAPIResponse[]> {
    return this.appService.getFilteredProviders(searchString, take, skip);
  }

  @Get('provider/:id')
  async getProviderById(@Param('id') id: string): Promise<Partial<Provider>> {
    return this.appService.getProviderById(parseInt(id));
  }
}
