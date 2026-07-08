import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get(':key')
  @Public()
  @ApiOperation({ summary: 'Get setting by key' })
  get(@Param('key') key: string) {
    return this.settingsService.get(key);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings (admin)' })
  getAll() {
    return this.settingsService.getAll();
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert setting (admin)' })
  upsert(@Param('key') key: string, @Body('value') value: any) {
    return this.settingsService.upsert(key, value);
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete setting (admin)' })
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
