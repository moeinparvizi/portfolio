import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'node:crypto';

@Injectable()
export class UploadService {
  private uploadDir: string;
  private storageUrl?: string;
  private storageKey?: string;
  private storageBucket: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', './uploads');
    this.storageUrl = this.configService.get<string>('SUPABASE_URL')?.replace(/\/$/, '');
    this.storageKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.storageBucket = this.configService.get('SUPABASE_STORAGE_BUCKET', 'portfolio-images');
    if (!(this.storageUrl && this.storageKey) && !fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async processImage(file: { buffer: Buffer; mimetype: string }): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    const filename = `${randomUUID()}.webp`;
    const filepath = path.join(this.uploadDir, filename);

    const image = sharp(file.buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 });

    if (this.storageUrl && this.storageKey) {
      const response = await fetch(
        `${this.storageUrl}/storage/v1/object/${this.storageBucket}/${filename}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.storageKey}`,
            apikey: this.storageKey,
            'Content-Type': 'image/webp',
          },
          body: new Uint8Array(await image.toBuffer()),
          signal: AbortSignal.timeout(30000),
        },
      );
      if (!response.ok) {
        throw new InternalServerErrorException('Image upload failed');
      }
      return `${this.storageUrl}/storage/v1/object/public/${this.storageBucket}/${filename}`;
    }

    await image.toFile(filepath);

    return `/uploads/${filename}`;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
