import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(publishedOnly = false) {
    const where: Prisma.ProjectWhereInput = publishedOnly
      ? { status: 'published' }
      : {};
    return this.prisma.project.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findFeatured() {
    return this.prisma.project.findMany({
      where: { status: 'published', featured: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    });
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({ data: dto as any });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }

  async forResume(locale: string) {
    return this.prisma.project.findMany({
      where: { includeInResume: true, status: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
