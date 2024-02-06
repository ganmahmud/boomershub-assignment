// scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { PrismaService } from './prisma.service';
import { AwsService } from './aws.service';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, PrismaService, AwsService],
})
export class ScraperModule {}
