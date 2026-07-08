import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(key: string) {
    const setting = await this.prisma.siteSettings.findUnique({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting '${key}' not found`);
    return setting;
  }

  async getAll() {
    return this.prisma.siteSettings.findMany();
  }

  async upsert(key: string, value: any) {
    return this.prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async remove(key: string) {
    return this.prisma.siteSettings.delete({ where: { key } });
  }
}
