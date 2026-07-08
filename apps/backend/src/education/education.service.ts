import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.education.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: string) {
    const edu = await this.prisma.education.findUnique({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    return edu;
  }

  async create(dto: CreateEducationDto) {
    const data = {
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
    };
    return this.prisma.education.create({ data: data as any });
  }

  async update(id: string, dto: UpdateEducationDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    return this.prisma.education.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.education.delete({ where: { id } });
  }

  async forResume() {
    return this.prisma.education.findMany({
      where: { includeInResume: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
