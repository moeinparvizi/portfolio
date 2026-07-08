import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async update(dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst();
    if (!existing) {
      return this.prisma.profile.create({ data: dto as any });
    }
    return this.prisma.profile.update({
      where: { id: existing.id },
      data: dto as any,
    });
  }
}
