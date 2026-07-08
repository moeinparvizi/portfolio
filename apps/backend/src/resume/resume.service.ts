import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as puppeteer from 'puppeteer';

interface ResumeOptions {
  locale: 'fa' | 'en' | 'de';
  showPhoto: boolean;
}

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) {}

  async generatePdf(options: ResumeOptions): Promise<Buffer> {
    const { locale, showPhoto } = options;

    // Gather data
    const profile = await this.prisma.profile.findFirst();
    const skills = await this.prisma.skill.findMany({ orderBy: { sortOrder: 'asc' } });
    const projects = await this.prisma.project.findMany({
      where: { includeInResume: true, status: 'published' },
      orderBy: { sortOrder: 'asc' },
    });
    const experience = await this.prisma.experience.findMany({
      where: { includeInResume: true },
      orderBy: { sortOrder: 'asc' },
    });
    const education = await this.prisma.education.findMany({
      where: { includeInResume: true },
      orderBy: { sortOrder: 'asc' },
    });

    const t = (obj: Record<string, any>) => obj?.[locale] || obj?.['en'] || '';

    const html = this.buildHtml(profile, skills, projects, experience, education, t, showPhoto, locale);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Wait for fonts
    await page.evaluateHandle('document.fonts.ready');

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  private buildHtml(
    profile: any,
    skills: any[],
    projects: any[],
    experience: any[],
    education: any[],
    t: (obj: Record<string, any>) => string,
    showPhoto: boolean,
    locale: string,
  ): string {
    const isRtl = locale === 'fa';
    const dir = isRtl ? 'rtl' : 'ltr';
    const fontFamily = isRtl
      ? "'Vazirmatn', 'Tahoma', sans-serif"
      : "'Inter', 'Helvetica Neue', sans-serif";

    return `
<!DOCTYPE html>
<html dir="${dir}" lang="${locale}">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Vazirmatn:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      font-size: 10px;
      line-height: 1.4;
      color: #1a1a2e;
      width: 794px;
      height: 1123px;
      padding: 32px 40px;
      background: #fff;
    }
    .header {
      display: flex;
      ${showPhoto ? 'align-items: center; gap: 20px;' : ''}
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #2563eb;
    }
    .header-text h1 { font-size: 22px; font-weight: 700; color: #0f172a; }
    .header-text .subtitle { font-size: 12px; color: #2563eb; font-weight: 500; margin-top: 2px; }
    .header-text .contact { font-size: 9px; color: #64748b; margin-top: 6px; }
    .photo {
      width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
      border: 2px solid #2563eb;
    }
    .section { margin-bottom: 12px; }
    .section-title {
      font-size: 11px; font-weight: 600; color: #2563eb;
      text-transform: uppercase; letter-spacing: 0.5px;
      margin-bottom: 6px; padding-bottom: 3px;
      border-bottom: 1px solid #e2e8f0;
    }
    .item { margin-bottom: 8px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; }
    .item-title { font-weight: 600; font-size: 10.5px; }
    .item-date { font-size: 9px; color: #64748b; white-space: nowrap; }
    .item-subtitle { font-size: 9.5px; color: #475569; margin-top: 1px; }
    .item-desc { font-size: 9px; color: #334155; margin-top: 3px; line-height: 1.5; }
    .skills-grid { display: flex; flex-wrap: wrap; gap: 4px; }
    .skill-tag {
      background: #eff6ff; color: #1e40af; padding: 2px 8px;
      border-radius: 4px; font-size: 9px; font-weight: 500;
    }
    .two-col { display: flex; gap: 24px; }
    .two-col > div { flex: 1; }
    ul { padding-${isRtl ? 'right' : 'left'}: 14px; }
    li { font-size: 9px; margin-bottom: 2px; }
  </style>
</head>
<body>
  <div class="header">
    ${showPhoto && profile?.avatarUrl ? `<img src="${profile.avatarUrl}" class="photo" alt="Photo" />` : ''}
    <div class="header-text">
      <h1>${t(profile?.fullName || {})}</h1>
      <div class="subtitle">${t(profile?.jobTitle || {})}</div>
      <div class="contact">${isRtl ? 'نمونه کار شخصی' : 'Personal Portfolio'}</div>
    </div>
  </div>

  ${profile?.summary?.[locale] ? `
  <div class="section">
    <div class="section-title">${isRtl ? 'خلاصه' : locale === 'de' ? 'Zusammenfassung' : 'Summary'}</div>
    <div class="item-desc">${t(profile.summary)}</div>
  </div>` : ''}

  ${skills.length > 0 ? `
  <div class="section">
    <div class="section-title">${isRtl ? 'مهارت‌ها' : locale === 'de' ? 'Fähigkeiten' : 'Skills'}</div>
    <div class="skills-grid">
      ${skills.map(s => `<span class="skill-tag">${t(s.name)}</span>`).join('')}
    </div>
  </div>` : ''}

  ${experience.length > 0 ? `
  <div class="section">
    <div class="section-title">${isRtl ? 'سوابق کاری' : locale === 'de' ? 'Berufserfahrung' : 'Experience'}</div>
    ${experience.map(e => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${t(e.position)}</span>
        <span class="item-date">${this.formatDate(e.startDate, locale)} – ${e.isCurrent ? (isRtl ? 'اکنون' : locale === 'de' ? 'Gegenwart' : 'Present') : this.formatDate(e.endDate, locale)}</span>
      </div>
      <div class="item-subtitle">${t(e.company)}${e.location ? ` · ${e.location}` : ''}</div>
      <div class="item-desc">${t(e.description)}</div>
    </div>`).join('')}
  </div>` : ''}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">${isRtl ? 'پروژه‌ها' : locale === 'de' ? 'Projekte' : 'Projects'}</div>
    ${projects.map(p => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${t(p.title)}</span>
      </div>
      <div class="item-desc">${t(p.summary || p.description)}</div>
    </div>`).join('')}
  </div>` : ''}

  ${education.length > 0 ? `
  <div class="section">
    <div class="section-title">${isRtl ? 'تحصیلات' : locale === 'de' ? 'Bildung' : 'Education'}</div>
    ${education.map(e => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${t(e.degree)} – ${t(e.fieldOfStudy)}</span>
        <span class="item-date">${this.formatDate(e.startDate, locale)} – ${this.formatDate(e.endDate, locale)}</span>
      </div>
      <div class="item-subtitle">${t(e.institution)}</div>
    </div>`).join('')}
  </div>` : ''}
</body>
</html>`;
  }

  private formatDate(date: Date | string | null, locale: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(locale === 'fa' ? 'fa-IR' : locale === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'short',
    });
  }
}
