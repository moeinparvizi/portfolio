import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, categoryId?: string, sort?: string) {
    const where: Prisma.BlogPostWhereInput = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    let orderBy: Prisma.BlogPostOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'views') orderBy = { views: 'desc' };
    if (sort === 'title') orderBy = { title: 'asc' };

    return this.prisma.blogPost.findMany({
      where,
      include: { category: true, comments: { where: { approved: true } } },
      orderBy,
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, comments: { where: { approved: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');

    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: { category: true, comments: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: any) {
    const slug = this.generateSlug(data.title?.en || '');
    const categoryId = data.categoryId || null;
    return this.prisma.blogPost.create({
      data: { ...data, slug, categoryId },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const categoryId = data.categoryId || null;
    return this.prisma.blogPost.update({
      where: { id },
      data: { ...data, categoryId },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }

  async search(query: string, status?: string) {
    const where: Prisma.BlogPostWhereInput = {
      tags: { has: query },
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    return this.prisma.blogPost.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();
  }
}
