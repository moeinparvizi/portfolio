import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsObject, IsOptional, IsString, IsBoolean, IsInt,
  IsDateString, Min,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty()
  @IsObject()
  company: Record<string, string>;

  @ApiProperty()
  @IsObject()
  position: Record<string, string>;

  @ApiProperty()
  @IsObject()
  description: Record<string, string>;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  includeInResume?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
