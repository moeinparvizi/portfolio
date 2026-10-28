import { ResumeService } from './resume.service';
import { PrismaService } from '../prisma/prisma.service';

const puppeteer = { launch: jest.fn() };
const chromium = {
  args: ['--serverless-chromium'],
  executablePath: async () => '/tmp/chromium',
};

describe('ResumeService on Vercel', () => {
  const originalVercel = process.env.VERCEL;
  let page: { setContent: jest.Mock; evaluateHandle: jest.Mock; pdf: jest.Mock };
  let browser: { newPage: jest.Mock; close: jest.Mock };
  let service: ResumeService;

  beforeEach(() => {
    process.env.VERCEL = '1';
    page = {
      setContent: jest.fn().mockResolvedValue(undefined),
      evaluateHandle: jest.fn().mockResolvedValue(undefined),
      pdf: jest.fn().mockResolvedValue(Buffer.from('%PDF-test')),
    };
    browser = {
      newPage: jest.fn().mockResolvedValue(page),
      close: jest.fn().mockResolvedValue(undefined),
    };
    puppeteer.launch.mockResolvedValue(browser);
    service = new ResumeService({
      profile: { findFirst: async () => ({ fullName: { en: 'Moein Parvizi' }, socialLinks: {} }) },
      skill: { findMany: async () => [] },
      project: { findMany: async () => [] },
      experience: { findMany: async () => [] },
      education: { findMany: async () => [] },
    } as unknown as PrismaService);
    jest.spyOn(service as any, 'loadBrowserDependencies').mockResolvedValue({ puppeteer, chromium });
  });

  afterEach(() => {
    if (originalVercel === undefined) delete process.env.VERCEL;
    else process.env.VERCEL = originalVercel;
    jest.clearAllMocks();
  });

  it('renders the PDF using the bundled serverless Chromium executable', async () => {
    const pdf = await service.generatePdf({ locale: 'en', showPhoto: false });
    expect(pdf.toString()).toBe('%PDF-test');
    expect(puppeteer.launch).toHaveBeenCalledWith(expect.objectContaining({
      executablePath: '/tmp/chromium',
      args: ['--serverless-chromium'],
      headless: 'shell',
    }));
  });

  it('closes Chromium when PDF rendering fails', async () => {
    page.pdf.mockRejectedValue(new Error('rendering failed'));
    await expect(service.generatePdf({ locale: 'en', showPhoto: false })).rejects.toThrow('rendering failed');
    expect(browser.close).toHaveBeenCalledTimes(1);
  });
});
