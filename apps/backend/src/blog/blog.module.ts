import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentService } from './blog-comment.service';

@Module({
  controllers: [BlogController, BlogCategoryController, BlogCommentController],
  providers: [BlogService, BlogCategoryService, BlogCommentService],
  exports: [BlogService],
})
export class BlogModule {}
