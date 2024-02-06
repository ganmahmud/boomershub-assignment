import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { AppService } from './app.service';
import { ScraperModule } from './scraper.module';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './aws.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AwsService],
})
export class AppModule {}
