import { StudentsModule } from '../../students.module';
import { Test } from '@nestjs/testing';
import { CurricullumModule } from '../../../curricullum/curricullum.module';
import { SubjectsModule } from '../../../subjects/subjects.module';
import { getSubjectIds } from '../../../subjects/test/helper/subjects.int-spec.helper';
import {
  createCurricullum,
  getDefaultSubjectNames,
} from '../../../curricullum/test/helper/curricullum.int-spec.helper';
import { PrismaService } from '../../../shared/services/prisma.service';
import { StudentsService } from '../../students.service';

describe('Students Int', () => {
  let prisma: PrismaService;
  let studentsService: StudentsService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [StudentsModule, CurricullumModule, SubjectsModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentsService = moduleRef.get<StudentsService>(StudentsService);
    await prisma.cleanDatabase();
  });

  describe('findAll()', () => {
    it('should throw an error if there are no students', async () => {
      await expect(studentsService.findAll()).rejects.toThrow(
        'There are no students',
      );
    });

    it('should return all students', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });
      const response = await prisma.student.findMany();
      expect(response).toEqual(expect.arrayContaining([createdStudent]));
    });
  });

  describe('findOne()', () => {
    it('should throw an error if the student does not exist', async () => {
      await expect(studentsService.findOne(9999)).rejects.toThrow(
        'Student not found',
      );
    });

    it('should return the student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });
      const response = await studentsService.findOne(createdStudent.id);
      expect(response).toEqual(createdStudent);
    });
  });

  describe('create()', () => {
    it('should throw an error if name is not found', async () => {
      await expect(
        studentsService.create({ name: null, curricullumId: 1 }),
      ).rejects.toThrow('Name or curricullumId not found');
    });

    it('should throw an error if name or curricullumId is not found', async () => {
      await expect(
        studentsService.create({ name: 'student1', curricullumId: null }),
      ).rejects.toThrow('Name or curricullumId not found');
    });

    it('should create a student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const response = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });
      expect(response.name).toEqual('student1');
    });
  });

  describe('delete()', () => {
    it('should throw an error if the student does not exist', async () => {
      await expect(studentsService.delete(9999)).rejects.toThrow(
        'Student not found',
      );
    });

    it('should delete the student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });
      await studentsService.delete(createdStudent.id);
      await expect(studentsService.findOne(createdStudent.id)).rejects.toThrow(
        'Student not found',
      );
    });
  });

  describe('update()', () => {
    it('should throw an error if the student does not exist', async () => {
      await expect(
        studentsService.update(9999, { name: 'student1', curricullumId: 1 }),
      ).rejects.toThrow('Student not found');
    });

    it('should throw an error if name or curricullumId is not found', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      await expect(
        studentsService.update(createdStudent.id, {
          name: null,
          curricullumId: 1,
        }),
      ).rejects.toThrow('Name or curricullumId not found');
    });

    it('should update the student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const response = await studentsService.update(createdStudent.id, {
        name: 'student2',
        curricullumId: createdCurricullum.id,
      });
      expect(response.name).toEqual('student2');
    });
  });

  describe('addGrade()', () => {
    it('should throw an error if the student does not exist', async () => {
      await expect(
        studentsService.addGrade({ studentId: 9999, subjectId: 1, value: 1 }),
      ).rejects.toThrow('Student not found');
    });

    it('should throw an error if the subject does not exist', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      await expect(
        studentsService.addGrade({
          studentId: createdStudent.id,
          subjectId: 9999,
          value: 1,
        }),
      ).rejects.toThrow('Subject not found');
    });

    it('should throw an error if the grade is not valid', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      await expect(
        studentsService.addGrade({
          studentId: createdStudent.id,
          subjectId: subjectIds[0],
          value: 101,
        }),
      ).rejects.toThrow('Invalid grade');
    });

    it('should add a grade to the student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const addedGrade = await studentsService.addGrade({
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
        value: 56,
      });
      const response = await prisma.grade.findMany({
        where: {
          studentId: createdStudent.id,
        },
      });
      expect(response).toEqual(expect.arrayContaining([addedGrade]));
    });
  });

  describe('updateGrade', () => {
    it('should throw an error if gradeId is not provided', async () => {
      const gradeDto = {
        value: 90,
      };

      await expect(studentsService.updateGrade(gradeDto)).rejects.toThrow(
        'Grade Id is required',
      );
    });

    it('should throw an error if grade value is not valid', async () => {
      const gradeDto = {
        gradeId: 1,
        value: 101,
      };

      await expect(studentsService.updateGrade(gradeDto)).rejects.toThrow(
        'Invalid grade',
      );
    });

    it('should update the grade if valid data is provided', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);
      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const addedGrade = await studentsService.addGrade({
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
        value: 56,
      });

      const gradeDto = {
        gradeId: addedGrade.id,
        value: 95,
      };

      const updatedGrade = await studentsService.updateGrade(gradeDto);

      expect(updatedGrade.value).toEqual(gradeDto.value);
    });
  });

  describe('findGradeBySubjectId', () => {
    it('should throw an error if the student does not exist', async () => {
      const gradeDto = {
        studentId: 9999,
        subjectId: 1,
      };

      await expect(
        studentsService.findStudentGradesBySubjectId(gradeDto),
      ).rejects.toThrow('Student not found');
    });

    it('should throw an error if the subject does not exist', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);
      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const gradeDto = {
        studentId: createdStudent.id,
        subjectId: 9999,
      };

      await expect(
        studentsService.findStudentGradesBySubjectId(gradeDto),
      ).rejects.toThrow('Subject not found');
    });

    it('should return all grades for given subject id', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const gradeDto = {
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
      };

      const addedGrade = await studentsService.addGrade({
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
        value: 56,
      });

      const sanitizedGrade = await prisma.grade.findUnique({
        where: {
          id: addedGrade.id,
        },
        select: {
          id: true,
          studentId: true,
          subjectId: true,
          value: true,
        },
      });

      const result =
        await studentsService.findStudentGradesBySubjectId(gradeDto);

      expect(result).toEqual(expect.arrayContaining([sanitizedGrade]));
    });
  });

  describe('findAllRecords', () => {
    it('should return all grades', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const addedGrade = await studentsService.addGrade({
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
        value: 56,
      });

      const result = await studentsService.findAllRecords();

      expect(result).toEqual(
        expect.arrayContaining([
          {
            value: addedGrade.value,
            subjectId: addedGrade.subjectId,
            students: {
              id: createdStudent.id,
              name: createdStudent.name,
              curricullumId: createdCurricullum.id,
            },
          },
        ]),
      );
    });
  });

  describe('findRecordsByStudent', () => {
    it('should throw an error if the student does not exist', async () => {
      await expect(studentsService.findRecordsByStudent(9999)).rejects.toThrow(
        'Student not found',
      );
    });

    it('should return all grades for a given student', async () => {
      const subjectIds = await getSubjectIds(prisma, getDefaultSubjectNames());
      const createdCurricullum = await createCurricullum(prisma, subjectIds);

      const createdStudent = await studentsService.create({
        name: 'student1',
        curricullumId: createdCurricullum.id,
      });

      const addedGrade = await studentsService.addGrade({
        studentId: createdStudent.id,
        subjectId: subjectIds[0],
        value: 56,
      });

      const result = await studentsService.findRecordsByStudent(
        createdStudent.id,
      );

      expect(result).toEqual(
        expect.arrayContaining([
          {
            value: addedGrade.value,
            subjectId: addedGrade.subjectId,
            students: {
              id: createdStudent.id,
              name: createdStudent.name,
              curricullumId: createdCurricullum.id,
            },
          },
        ]),
      );
    });
  });
});
