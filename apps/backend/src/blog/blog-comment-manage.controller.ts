import { Controller, Put, Delete, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogCommentService } from './blog-comment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Blog Comment Management')
@Controller('blog/comments')
export class BlogCommentManageController {
  constructor(private commentService: BlogCommentService) {}

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve comment (admin)' })
  approve(@Param('id') id: string) {
    return this.commentService.approve(id);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reply to comment (admin)' })
  reply(@Param('id') id: string, @Body() dto: any) {
    return this.commentService.reply(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment (admin)' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
