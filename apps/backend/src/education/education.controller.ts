import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Education')
@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all education' })
  findAll() {
    return this.educationService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get education by ID' })
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create education (admin)' })
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update education (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.educationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete education (admin)' })
  remove(@Param('id') id: string) {
    return this.educationService.remove(id);
  }
}
