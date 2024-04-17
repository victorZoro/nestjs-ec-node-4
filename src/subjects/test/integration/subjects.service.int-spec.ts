import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../shared/services/prisma.service';
import { SubjectsModule } from '../../subjects.module';
import { SubjectsService } from '../../subjects.service';
import { getSubjectIds } from '../helper/subjects.int-spec.helper';
import { CurricullumModule } from '../../../curricullum/curricullum.module';
import {
  createCurricullum,
  getDefaultSubjectNames,
} from '../../../curricullum/test/helper/curricullum.int-spec.helper';

describe('Subjects Integration Tests', () => {
  let prisma: PrismaService;
  let subjectsService: SubjectsService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SubjectsModule, CurricullumModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    subjectsService = moduleRef.get<SubjectsService>(SubjectsService);
    await prisma.cleanDatabase();
  });

  describe('findAll()', () => {
    it('should return all subjects', async () => {
      const createdSubject = await subjectsService.create({
        name: 'findAllTest',
      });
      const response = await subjectsService.findAll();
      expect(response).toEqual(expect.arrayContaining([createdSubject]));
    });
  });

  describe('findOne()', () => {
    it('should return a subject', async () => {
      const createdSubject = await subjectsService.create({
        name: 'findOneTest',
      });
      const response = await subjectsService.findOne(createdSubject.id);
      expect(response).toEqual(createdSubject);
    });
  });

  describe('findCurricullumBySubjectId()', () => {
    it('should return the curriculums that contain the subject', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const response = await subjectsService.findCurricullumBySubjectId(
        subjectIds[0],
      );

      expect(response).toEqual(
        expect.arrayContaining([{ curricullumId: createdCurricullum.id }]),
      );
    });
  });

  describe('delete()', () => {
    it('should delete a subject', async () => {
      const createdSubject = await subjectsService.create({
        name: 'deleteTest',
      });
      const response = await subjectsService.delete(createdSubject.id);
      expect(response).toEqual(createdSubject);
    });

    it('should throw an error if subject is not found', async () => {
      await expect(subjectsService.delete(9999)).rejects.toThrow(
        'Subject not found',
      );
    });
  });

  describe('create()', () => {
    it('should create a subject', async () => {
      const response = await subjectsService.create({ name: 'Math' });
      expect(response).toEqual({ id: expect.any(Number), name: 'Math' });
    });

    it('should throw an error if name is empty', async () => {
      const subjectDto = {
        name: '',
      };
      await expect(subjectsService.create(subjectDto)).rejects.toThrow(
        'Name not found',
      );
    });
  });

  describe('update()', () => {
    it('should update a subject', async () => {
      const createdSubject = await subjectsService.create({
        name: 'updateTest',
      });

      const response = await subjectsService.update(createdSubject.id, {
        name: 'updatedName',
      });

      expect(response).toEqual({
        id: createdSubject.id,
        name: 'updatedName',
      });
    });

    it('should throw an error if subject is not found', async () => {
      await expect(
        subjectsService.update(9999, { name: 'updatedName' }),
      ).rejects.toThrow('Subject not found');
    });

    it('should throw an error if name is empty', async () => {
      const createdSubject = await subjectsService.create({
        name: 'updateTest',
      });

      await expect(
        subjectsService.update(createdSubject.id, { name: '' }),
      ).rejects.toThrow('Name not found');
    });
  });
});
