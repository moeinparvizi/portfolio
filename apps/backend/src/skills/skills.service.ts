import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async create(dto: CreateSkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async update(id: string, dto: UpdateSkillDto) {
    await this.findOne(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.skill.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.skill.update({ where: { id }, data: { sortOrder: index } }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }
}
