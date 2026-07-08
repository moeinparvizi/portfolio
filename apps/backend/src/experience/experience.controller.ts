import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Experience')
@Controller('experience')
export class ExperienceController {
  constructor(private experienceService: ExperienceService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all experiences' })
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get experience by ID' })
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create experience (admin)' })
  create(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update experience (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.experienceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete experience (admin)' })
  remove(@Param('id') id: string) {
    return this.experienceService.remove(id);
  }
}
