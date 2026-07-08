import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock } };
  let jwt: { signAsync: jest.Mock; verify: jest.Mock };
  let config: { get: jest.Mock };

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn() } };
    jwt = { signAsync: jest.fn().mockResolvedValue('token'), verify: jest.fn() };
    config = { get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'secret';
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      return null;
    }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid username', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ username: 'wrong', password: 'pass' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hash = await argon2.hash('correctpassword');
      prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', passwordHash: hash });
      await expect(service.login({ username: 'admin', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens for valid credentials', async () => {
      const hash = await argon2.hash('password123');
      prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', passwordHash: hash });
      jwt.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login({ username: 'admin', password: 'password123' });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', username: 'admin', createdAt: new Date() });
      const result = await service.getProfile('1');
      expect(result).toBeDefined();
    });
  });
});
