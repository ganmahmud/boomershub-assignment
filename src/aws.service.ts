import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private readonly bucketUrl: string = `${this.configService.get<string>(
    'AWS_S3_ENDPOINT',
  )}/${this.configService.get<string>('AWS_S3_BUCKET_NAME')}`;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(localFilePath: string, fileName: string): Promise<any> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: fs.readFileSync(localFilePath),
    });

    try {
      const response = await this.s3.send(command);
      return `${this.bucketUrl}/${fileName}`;
    } catch (err) {
      console.error(err);
    }
  }
}
