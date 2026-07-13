import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(publishedOnly = false) {
    const where: Prisma.BlogPostWhereInput = publishedOnly
      ? { status: 'published' }
      : {};
    return this.prisma.blogPost.findMany({
      where,
      include: { category: true, comments: { where: { approved: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, comments: { where: { approved: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');

    // Increment views
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
    // Generate slug from title
    const slug = this.generateSlug(data.title?.en || '');
    return this.prisma.blogPost.create({
      data: { ...data, slug },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.blogPost.delete({ where: { id } });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.blogPost.findMany({
      where: { categoryId, status: 'published' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(query: string) {
    return this.prisma.blogPost.findMany({
      where: {
        status: 'published',
        tags: { has: query },
      },
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
