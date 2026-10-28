import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

jest.mock('./resume.service', () => ({ ResumeService: class ResumeService {} }));

describe('Resume request validation', () => {
  let app: INestApplication;
  const generatePdf = jest.fn().mockResolvedValue(Buffer.from('%PDF-test'));

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ResumeController],
      providers: [{ provide: ResumeService, useValue: { generatePdf } }],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('preserves the requested Persian locale and photo preference', async () => {
    const response = await request(app.getHttpServer())
      .post('/resume/generate').send({ locale: 'fa', showPhoto: false }).expect(201);
    expect(generatePdf).toHaveBeenLastCalledWith({ locale: 'fa', showPhoto: false });
    expect(response.headers['content-disposition']).toContain('resume-fa.pdf');
  });

  it('rejects unsupported locales before launching the browser', async () => {
    await request(app.getHttpServer()).post('/resume/generate')
      .send({ locale: 'unknown', showPhoto: true }).expect(400);
  });
});
