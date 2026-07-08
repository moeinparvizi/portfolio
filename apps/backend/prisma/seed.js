const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await argon2.hash('admin123');
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
    },
  });
  console.log('✓ Admin user created (admin / admin123)');

  // Create default profile
  await prisma.profile.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      fullName: { en: 'Your Name', fa: 'نام شما', de: 'Ihr Name' },
      jobTitle: {
        en: 'Full-Stack Developer',
        fa: 'توسعه‌دهنده فول‌استک',
        de: 'Full-Stack Entwickler',
      },
      summary: {
        en: 'A passionate developer building modern web applications.',
        fa: 'توسعه‌دهنده‌ای پرشور که اپلیکیشن‌های وب مدرن می‌سازد.',
        de: 'Ein leidenschaftlicher Entwickler moderner Webanwendungen.',
      },
      heroText: {
        en: 'Building digital experiences that matter.',
        fa: 'ساخت تجربه‌های دیجیتال ارزشمند.',
        de: 'Digitale Erlebnisse schaffen, die zählen.',
      },
      heroCtaLabel: {
        en: 'View My Work',
        fa: 'مشاهده کارهای من',
        de: 'Meine Arbeit ansehen',
      },
      heroCtaLink: '/en/projects',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
  });
  console.log('✓ Default profile created');

  // Create default site settings
  const defaultSettings = [
    {
      key: 'theme',
      value: {
        primaryColor: '#2563EB',
        secondaryColor: '#7C3AED',
        accentColor: '#06B6D4',
        defaultMode: 'dark',
        fontDisplay: 'Space Grotesk',
        fontBody: 'Inter',
      },
    },
    {
      key: 'seo',
      value: {
        home: {
          en: { title: 'Portfolio', description: 'Personal portfolio website' },
          fa: { title: 'پورتفولیو', description: 'وب‌سایت پورتفولیوی شخصی' },
          de: { title: 'Portfolio', description: 'Persönliche Portfolio-Website' },
        },
      },
    },
    {
      key: 'footer',
      value: {
        copyrightText: {
          en: '© 2026 All rights reserved.',
          fa: '© ۲۰۲۶ تمامی حقوق محفوظ است.',
          de: '© 2026 Alle Rechte vorbehalten.',
        },
        quickLinks: [],
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
        },
      },
    },
    {
      key: 'general',
      value: {
        defaultLanguage: 'en',
        maintenanceMode: false,
        analyticsEnabled: false,
      },
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✓ Default site settings created');

  console.log('\n🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
