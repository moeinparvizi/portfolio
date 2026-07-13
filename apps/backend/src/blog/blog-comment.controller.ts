import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogCommentService } from './blog-comment.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Blog Comments')
@Controller('blog/:postId/comments')
export class BlogCommentController {
  constructor(private commentService: BlogCommentService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get comments for a post' })
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @Post()
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Add comment to a post' })
  create(@Param('postId') postId: string, @Body() dto: any) {
    return this.commentService.create(postId, dto);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve comment (admin)' })
  approve(@Param('id') id: string) {
    return this.commentService.approve(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment (admin)' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
