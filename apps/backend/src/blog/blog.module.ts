import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogCategoryController } from './blog-category.controller';
import { BlogCategoryService } from './blog-category.service';
import { BlogCommentController } from './blog-comment.controller';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentManageController } from './blog-comment-manage.controller';

@Module({
  controllers: [BlogController, BlogCategoryController, BlogCommentController, BlogCommentManageController],
  providers: [BlogService, BlogCategoryService, BlogCommentService],
  exports: [BlogService],
})
export class BlogModule {}
