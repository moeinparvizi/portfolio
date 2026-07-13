import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { ResumeService } from './resume.service';
import { Public } from '../common/decorators/public.decorator';

class GenerateResumeDto {
  locale: 'fa' | 'en' | 'de';
  showPhoto: boolean;
}

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post('generate')
  @Public()
  @ApiOperation({ summary: 'Generate resume PDF (public)' })
  async generate(
    @Body() dto: GenerateResumeDto,
    @Res() res: Response,
  ) {
    const buffer = await this.resumeService.generatePdf({
      locale: dto.locale || 'en',
      showPhoto: dto.showPhoto ?? true,
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${dto.locale}.pdf"`,
    });
    res.end(buffer);
  }
}
