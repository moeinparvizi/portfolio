import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

describe('Project publication boundaries', () => {
  let app: INestApplication;
  const projects = [
    { id: 'published-project', status: 'published' },
    { id: 'draft-project', status: 'draft' },
  ];

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule],
      controllers: [ProjectsController],
      providers: [
        ProjectsService, JwtStrategy,
        { provide: ConfigService, useValue: new ConfigService({ JWT_SECRET: 'test-secret' }) },
        {
          provide: PrismaService,
          useValue: {
            project: {
              findMany: async ({ where }: { where: { status?: string } }) => projects.filter(p => !where.status || p.status === where.status),
              findUnique: async ({ where }: { where: { id: string } }) => projects.find(p => p.id === where.id) ?? null,
            },
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('does not expose drafts through query parameters on the public list', async () => {
    const response = await request(app.getHttpServer()).get('/projects?all=true&published=false').expect(200);
    expect(response.body.map((p: { id: string }) => p.id)).toEqual(['published-project']);
  });

  it('requires authentication to list projects for the admin panel', async () => {
    await request(app.getHttpServer()).get('/projects/admin/all').expect(401);
  });

  it('allows an authenticated admin to see drafts', async () => {
    const token = new JwtService({ secret: 'test-secret' }).sign({ sub: 'admin', username: 'admin' });
    const response = await request(app.getHttpServer()).get('/projects/admin/all').auth(token, { type: 'bearer' }).expect(200);
    expect(response.body.map((p: { id: string }) => p.id)).toEqual(['published-project', 'draft-project']);
  });

  it('does not expose a draft through its public detail URL', async () => {
    await request(app.getHttpServer()).get('/projects/draft-project').expect(404);
  });
});
