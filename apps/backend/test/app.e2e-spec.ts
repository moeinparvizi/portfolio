import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Portfolio API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET) - should return ok', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
        });
    });
  });

  describe('Auth', () => {
    it('/api/auth/login (POST) - should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          accessToken = res.body.accessToken;
        });
    });

    it('/api/auth/login (POST) - should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Profile', () => {
    it('/api/profile (GET) - should return profile', () => {
      return request(app.getHttpServer())
        .get('/api/profile')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('fullName');
          expect(res.body).toHaveProperty('jobTitle');
        });
    });
  });

  describe('Skills', () => {
    it('/api/skills (GET) - should return skills array', () => {
      return request(app.getHttpServer())
        .get('/api/skills')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('/api/skills (POST) - should require auth', () => {
      return request(app.getHttpServer())
        .post('/api/skills')
        .send({ name: { en: 'Test' } })
        .expect(401);
    });

    it('/api/skills (POST) - should create skill with auth', () => {
      return request(app.getHttpServer())
        .post('/api/skills')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: { en: 'TypeScript' }, category: 'Frontend', level: 4 })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });

  describe('Projects', () => {
    it('/api/projects (GET) - should return projects array', () => {
      return request(app.getHttpServer())
        .get('/api/projects')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Settings', () => {
    it('/api/settings/theme (GET) - should return theme settings', () => {
      return request(app.getHttpServer())
        .get('/api/settings/theme')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('key', 'theme');
          expect(res.body).toHaveProperty('value');
        });
    });
  });
});
