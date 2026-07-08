import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  fullName?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  jobTitle?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  summary?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  heroText?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  heroCtaLabel?: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroCtaLink?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}
