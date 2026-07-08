import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: { project: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      project: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: '1', ...args.data })),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return published projects by default', async () => {
      await service.findAll();
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'published' },
        }),
      );
    });

    it('should return all projects when publishedOnly is false', async () => {
      await service.findAll(false);
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException for non-existent project', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return project by id', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: '1', title: { en: 'Test' } });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });
  });

  describe('findFeatured', () => {
    it('should return featured published projects', async () => {
      await service.findFeatured();
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'published', featured: true },
          take: 6,
        }),
      );
    });
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const dto = {
        title: { en: 'Test Project' },
        description: { en: 'Description' },
        summary: { en: 'Summary' },
        images: [],
        tags: ['Angular'],
        status: 'published',
      };
      const result = await service.create(dto as any);
      expect(result).toHaveProperty('id');
    });
  });
});
