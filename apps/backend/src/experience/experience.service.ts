import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: string) {
    const exp = await this.prisma.experience.findUnique({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    return exp;
  }

  async create(dto: CreateExperienceDto) {
    return this.prisma.experience.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateExperienceDto) {
    await this.findOne(id);
    return this.prisma.experience.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.experience.delete({ where: { id } });
  }

  async forResume() {
    return this.prisma.experience.findMany({
      where: { includeInResume: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
