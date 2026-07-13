import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blogCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  async findOne(id: string) {
    const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async findBySlug(slug: string) {
    const cat = await this.prisma.blogCategory.findUnique({
      where: { slug },
      include: { posts: { where: { status: 'published' } } },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: any) {
    const slug = this.generateSlug(data.name?.en || '');
    return this.prisma.blogCategory.create({ data: { ...data, slug } });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.blogCategory.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogCategory.delete({ where: { id } });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
