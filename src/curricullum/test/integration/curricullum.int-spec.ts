import { PrismaService } from '../../../shared/services/prisma.service';
import { Test } from '@nestjs/testing';
import { CurricullumModule } from '../../curricullum.module';
import { CurricullumService } from '../../curricullum.service';
import { getSubjectIds } from '../../../subjects/test/helper/subjects.int-spec.helper';
import { getDefaultSubjectNames } from '../helper/curricullum.int-spec.helper';

describe('Curricullum Integration Tests', () => {
  let prisma: PrismaService;
  let curricullumsService: CurricullumService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CurricullumModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    curricullumsService = moduleRef.get<CurricullumService>(CurricullumService);
    await prisma.cleanDatabase();
  });

  describe('findALl()', () => {
    it('should return all curriculums', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      await curricullumsService.create(subjectIds);

      const response = await curricullumsService.findAll();
      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            subjects: expect.arrayContaining(
              subjectIds.map((subjectId) =>
                expect.objectContaining({ subjectId }),
              ),
            ),
          }),
        ]),
      );
    });
  });

  describe('findOne()', () => {
    it('should return a curricullum', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await curricullumsService.create(subjectIds);
      const response = await curricullumsService.findOne(createdCurricullum.id);

      expect(response).toEqual({
        curricullum: expect.objectContaining({
          id: createdCurricullum.id,
        }),
        subjects: expect.arrayContaining(
          subjectIds.map((subjectId) => expect.objectContaining({ subjectId })),
        ),
      });
    });

    it('should throw an error if the curricullum does not exist', async () => {
      await expect(curricullumsService.findOne(1)).rejects.toThrow(
        'Curricullum not found',
      );
    });
  });

  describe('addSubject()', () => {
    it('should add a subject to a curriculum', async () => {
      const subjectName = 'newSubject';
      const createdSubject = await prisma.subject.create({
        data: { name: subjectName },
      });

      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());

      const createdCurricullum = await curricullumsService.create(subjectIds);

      const curricullumDto = {
        curricullumId: createdCurricullum.id,
        subjectId: createdSubject.id,
      };

      await curricullumsService.addSubject(curricullumDto);

      const response = await curricullumsService.findOne(createdCurricullum.id);

      expect(response).toEqual({
        curricullum: expect.objectContaining({
          id: createdCurricullum.id,
        }),
        subjects: expect.arrayContaining([
          ...subjectIds.map((subjectId) =>
            expect.objectContaining({ subjectId }),
          ),
          expect.objectContaining({ subjectId: createdSubject.id }),
        ]),
      });
    });

    it('should throw an error if the subject is not added to the curriculum', async () => {
      const curricullumDto = {
        curricullumId: 1,
        subjectId: 9999,
      };

      await expect(
        curricullumsService.addSubject(curricullumDto),
      ).rejects.toThrow('Subject not added to curricullum');
    });
  });

  describe('create()', () => {
    it('should create a curricullum', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());

      const response = await curricullumsService.create(subjectIds);

      expect(response).toEqual({
        id: expect.any(Number),
        subjects: subjectIds.map((subjectId) => ({ subjectId })),
      });
    });

    it('should throw an error if the number of subjects is not 5', async () => {
      await expect(curricullumsService.create([1, 2, 3, 4])).rejects.toThrow(
        'Minimum subject count is not met',
      );
    });

    it('should throw an error if one or more subjects do not exist', async () => {
      const subjects = await prisma.subject.findMany({
        select: {
          id: true,
        },
        orderBy: {
          id: 'desc',
        },
        take: 4,
      });

      const nonExistentId = subjects[0].id + 1;

      const subjectIds = subjects.map((subject) => subject.id);
      subjectIds.push(nonExistentId);

      await expect(curricullumsService.create(subjectIds)).rejects.toThrow(
        'One or more subjects do not exist',
      );
    });

    it('should throw an error if the curricullum is not created', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());

      jest.spyOn(prisma.curricullum, 'create').mockResolvedValue(null);

      await expect(curricullumsService.create(subjectIds)).rejects.toThrow(
        'Curricullum not created',
      );
    });

    it('should throw an error if the curricullumSubjects are not created', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());

      jest.spyOn(prisma.curricullumSubject, 'create').mockResolvedValue(null);

      await expect(curricullumsService.create(subjectIds)).rejects.toThrow(
        'Curricullum not created',
      );
    });
  });
});
