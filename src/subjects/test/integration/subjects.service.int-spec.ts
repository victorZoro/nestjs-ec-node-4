import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../shared/services/prisma.service';
import { SubjectsModule } from '../../subjects.module';
import { SubjectsService } from '../../subjects.service';

describe('Subjects Integration Tests', () => {
  let prisma: PrismaService;
  let subjectsService: SubjectsService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SubjectsModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    subjectsService = moduleRef.get<SubjectsService>(SubjectsService);
    await prisma.cleanDatabase();
  });

  describe('create()', () => {
    it('should create a subject', async () => {
      const response = await subjectsService.create({ name: 'Math' });
      expect(response).toEqual({ id: 1, name: 'Math' });
    });
  });

  describe('findAll()', () => {
    it('should return all subjects', async () => {
      await subjectsService.create({ name: 'findAllTest' });
      const response = await subjectsService.findAll();
      expect(response).toEqual([
        { id: 1, name: 'Math' },
        { id: 2, name: 'findAllTest' },
      ]);
    });
  });

  describe('findOne()', () => {
    it('should return a subject', async () => {
      await subjectsService.create({ name: 'findOneTest' });
      const response = await subjectsService.findOne(3);
      expect(response).toEqual({ id: 3, name: 'findOneTest' });
    });
  });
});
