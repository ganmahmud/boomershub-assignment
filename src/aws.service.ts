import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: 'http://s3.localhost.localstack.cloud:4566',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(localFilePath: string, fileName: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: fs.readFileSync(localFilePath),
    });

    try {
      const response = await this.s3.send(command);
      return `${this.configService.get<string>('AWS_S3_BUCKET_NAME')}/${fileName}`;
    } catch (err) {
      console.error(err);
    }
  }
}
