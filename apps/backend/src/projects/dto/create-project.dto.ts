import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject, IsOptional, IsString, IsArray, IsBoolean,
  IsInt, IsEnum, Min,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty()
  @IsObject()
  title: Record<string, string>;

  @ApiProperty()
  @IsObject()
  description: Record<string, string>;

  @ApiProperty()
  @IsObject()
  summary: Record<string, string>;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  liveUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeInResume?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
