import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: { skill: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock; $transaction: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      skill: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: '1', ...args.data })),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
        delete: jest.fn().mockResolvedValue({ id: '1' }),
        $transaction: jest.fn().mockImplementation((ops) => Promise.all(ops)),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SkillsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all skills', async () => {
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(prisma.skill.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException for non-existent skill', async () => {
      prisma.skill.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return skill by id', async () => {
      prisma.skill.findUnique.mockResolvedValue({ id: '1', name: { en: 'TypeScript' } });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });
  });

  describe('create', () => {
    it('should create a new skill', async () => {
      const dto = { name: { en: 'TypeScript' }, category: 'Frontend', level: 4 };
      const result = await service.create(dto as any);
      expect(result).toHaveProperty('id');
      expect(prisma.skill.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw NotFoundException for non-existent skill', async () => {
      prisma.skill.findUnique.mockResolvedValue(null);
      await expect(service.update('nonexistent', {})).rejects.toThrow(NotFoundException);
    });

    it('should update skill', async () => {
      prisma.skill.findUnique.mockResolvedValue({ id: '1' });
      const result = await service.update('1', { level: 5 } as any);
      expect(prisma.skill.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException for non-existent skill', async () => {
      prisma.skill.findUnique.mockResolvedValue(null);
      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should delete skill', async () => {
      prisma.skill.findUnique.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
