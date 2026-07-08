import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, IsBoolean, IsInt, IsDateString, Min } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty()
  @IsObject()
  institution: Record<string, string>;

  @ApiProperty()
  @IsObject()
  degree: Record<string, string>;

  @ApiProperty()
  @IsObject()
  fieldOfStudy: Record<string, string>;

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
  includeInResume?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
