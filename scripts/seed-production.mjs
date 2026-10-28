import { createRequire } from 'node:module';

const require = createRequire(new URL('../apps/backend/package.json', import.meta.url));
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const prisma = new PrismaClient();

const tr = (en, fa = en, de = en) => ({ en, fa, de });

try {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 20) {
    throw new Error('Set ADMIN_USERNAME and a unique ADMIN_PASSWORD of at least 20 characters.');
  }
  await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: {},
    create: { username: ADMIN_USERNAME, passwordHash: await argon2.hash(ADMIN_PASSWORD) },
  });

  await prisma.profile.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      fullName: tr('Moein Parvizi', 'معین پرویزی'),
      jobTitle: tr('Frontend Developer', 'توسعه‌دهنده فرانت‌اند', 'Frontend-Entwickler'),
      summary: tr(
        'I build web interfaces with TypeScript, React, Next.js and Angular, with backend experience to connect the pieces.',
        'با تایپ‌اسکریپت، ری‌اکت، نکست‌جی‌اس و انگولار رابط‌های وب می‌سازم و برای اتصال بخش‌های برنامه تجربهٔ بک‌اند هم دارم.',
        'Ich entwickle Weboberflächen mit TypeScript, React, Next.js und Angular und bringe auch Backend-Erfahrung mit.',
      ),
      heroText: tr('Hi, I’m Moein. I build for the web.', 'سلام، من معینم؛ برای وب می‌سازم.', 'Hi, ich bin Moein. Ich entwickle fürs Web.'),
      heroCtaLabel: tr('Explore my work', 'مشاهدهٔ نمونه‌کارها', 'Meine Projekte ansehen'),
      heroCtaLink: '/projects',
      socialLinks: {
        github: 'https://github.com/moeinparvizi',
        linkedin: 'https://www.linkedin.com/in/moeinparvizi2002/',
        website: 'https://moeinparvizi.com',
      },
    },
  });

  const skills = ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Angular', 'HTML & CSS', 'Tailwind CSS', 'Python & Django', 'Git', 'Linux'];
  for (const [index, name] of skills.entries()) {
    const id = `10000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`;
    await prisma.skill.upsert({
      where: { id }, update: {},
      create: { id, name: tr(name), category: index < 7 ? 'Frontend' : 'Tools & backend', sortOrder: index },
    });
  }

  const projects = [
    {
      slug: 'portfolio', title: 'Portfolio',
      summary: tr('A multilingual portfolio with an admin dashboard.', 'پورتفولیوی چندزبانه با پنل مدیریت.', 'Ein mehrsprachiges Portfolio mit Admin-Dashboard.'),
      description: tr('Personal portfolio built with Angular, NestJS and PostgreSQL, with light and dark themes and English, Farsi and German support.', 'پورتفولیوی شخصی با انگولار، NestJS و PostgreSQL، پوستهٔ روشن و تیره و پشتیبانی فارسی، انگلیسی و آلمانی.'),
      tags: ['Angular', 'TypeScript', 'NestJS', 'PostgreSQL'],
    },
    {
      slug: 'music-player', title: 'Music Player',
      summary: tr('A responsive music interface with motion and API integration.', 'رابط واکنش‌گرای پخش موسیقی با انیمیشن و اتصال به API.', 'Ein responsiver Musikplayer mit Animationen und API-Anbindung.'),
      description: tr('A music interface built with React and Next.js, using Framer Motion for animations.', 'رابط پخش موسیقی با ری‌اکت و نکست‌جی‌اس و انیمیشن‌های Framer Motion.'),
      tags: ['React', 'Next.js', 'JavaScript', 'Framer Motion'],
    },
    {
      slug: 'neovim', title: 'Neovim Configuration',
      summary: tr('My personal Neovim configuration in Lua.', 'تنظیمات شخصی Neovim با زبان Lua.', 'Meine persönliche Neovim-Konfiguration in Lua.'),
      description: tr('A look at my personal editor configuration and development tools.', 'نگاهی به تنظیمات ویرایشگر و ابزارهای توسعهٔ من.'),
      tags: ['Lua', 'Neovim', 'Linux'],
    },
  ];
  for (const [index, project] of projects.entries()) {
    const { slug, title, ...data } = project;
    const id = `20000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`;
    await prisma.project.upsert({
      where: { id }, update: {},
      create: {
        id, ...data, title: tr(title), githubUrl: `https://github.com/moeinparvizi/${slug}`,
        status: 'published', featured: true, includeInResume: true, sortOrder: index,
      },
    });
  }

  for (const [key, value] of Object.entries({
    footer: {
      copyrightText: tr('© 2026 Moein Parvizi', '© ۲۰۲۶ معین پرویزی'),
      quickLinks: [],
      socialLinks: { github: 'https://github.com/moeinparvizi', linkedin: 'https://www.linkedin.com/in/moeinparvizi2002/' },
    },
    general: { defaultLanguage: 'en', maintenanceMode: false, analyticsEnabled: false },
  })) {
    await prisma.siteSettings.upsert({ where: { key }, update: {}, create: { key, value } });
  }
  console.log('Production profile, skills, projects and admin initialized. Existing records were preserved.');
} finally {
  await prisma.$disconnect();
}
