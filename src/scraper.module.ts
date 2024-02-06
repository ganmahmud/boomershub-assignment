// scraper.module.ts
import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { PrismaService } from './prisma.service';

@Module({
    controllers: [ScraperController],
    providers: [ScraperService, PrismaService],
})
export class ScraperModule {}
