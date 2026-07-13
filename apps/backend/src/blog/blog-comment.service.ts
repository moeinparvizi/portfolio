import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogCommentService {
  constructor(private prisma: PrismaService) {}

  async findByPost(postId: string) {
    return this.prisma.blogComment.findMany({
      where: { postId, approved: true },
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
