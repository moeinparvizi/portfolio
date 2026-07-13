import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogCommentService {
  constructor(private prisma: PrismaService) {}

  async findByPost(postId: string) {
    // Get top-level comments with their replies
    return this.prisma.blogComment.findMany({
      where: { postId, parentId: null, approved: true },
      include: {
        replies: {
          where: { approved: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.blogComment.findMany({
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(postId: string, data: any) {
    // Verify post exists
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.blogComment.create({
      data: { ...data, postId },
    });
  }

  async reply(parentId: string, data: any) {
    // Get parent comment to get postId
    const parent = await this.prisma.blogComment.findUnique({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Parent comment not found');

    // Admin replies are auto-approved
    return this.prisma.blogComment.create({
      data: {
        postId: parent.postId,
        parentId,
        name: data.name,
        email: data.email,
        content: data.content,
        approved: true,
      },
    });
  }

  async approve(id: string) {
    return this.prisma.blogComment.update({
      where: { id },
      data: { approved: true },
    });
  }

  async remove(id: string) {
    return this.prisma.blogComment.delete({ where: { id } });
  }
}
