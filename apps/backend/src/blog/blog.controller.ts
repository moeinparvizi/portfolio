import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog posts with filters' })
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
  ) {
    return this.blogService.findAll(status, category, sort);
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search blog posts' })
  search(@Query('q') query: string, @Query('status') status?: string) {
    return this.blogService.search(query || '', status);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get post by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog post (admin)' })
  create(@Body() dto: any) {
    return this.blogService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post (admin)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post (admin)' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  // This route must be LAST to avoid matching 'categories', 'search', etc.
  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get post by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }
}
