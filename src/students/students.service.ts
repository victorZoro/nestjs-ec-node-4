import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { isSubjectCompleted } from '../shared/helper/isSubjectCompleted.helper';
import { GradeDto } from '../shared/dto/grade.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return await this.prisma.student.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return await this.prisma.student.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAllByScore(): Promise<any> {
    try {
      return await this.prisma.$queryRaw`
      SELECT 
        students.*, 
        (SELECT AVG(value) FROM Grade WHERE studentId = students.id) as avgGrade
      FROM 
        Student students
      ORDER BY 
        avgGrade DESC
    `;
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      return await this.prisma.student.create({
        data: {
          name: createStudentDto.name,
          curricullumId: createStudentDto.curricullumId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAllGrades(studentId: number): Promise<any> {
    try {
      return await this.prisma.grade.findMany({
        where: {
          studentId: studentId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findGradeBySubjectId(gradeDto: GradeDto): Promise<any> {
    try {
      return await this.prisma.grade.findMany({
        where: {
          studentId: gradeDto.studentId,
          subjectId: gradeDto.subjectId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async addGrade(gradeDto: GradeDto) {
    try {
      await this.isSubjectCompleted(gradeDto);

      return await this.prisma.grade.create({
        data: {
          studentId: gradeDto.studentId,
          subjectId: gradeDto.subjectId,
          value: gradeDto.value,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  //TODO: Move function to helper package
  async isSubjectCompleted(gradeDto: GradeDto) {
    if (!(await isSubjectCompleted(gradeDto))) {
      throw new Error(
        'This subject has been completed and cannot accept new grades.',
      );
    }
  }

  async updateGradeByGrade(gradeDto: GradeDto) {
    try {
      return await this.prisma.grade.update({
        where: {
          id: gradeDto.gradeId,
        },
        data: {
          value: gradeDto.value,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAllRecords() {
    try {
      return await this.prisma.grade.findMany({
        select: {
          value: true,
          subjectId: true,
          students: {
            select: {
              id: true,
              name: true,
              curricullumId: true,
            },
          },
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findRecordsByStudent(studentId: number) {
    try {
      return await this.prisma.grade.findMany({
        where: {
          studentId: studentId,
        },
        select: {
          value: true,
          subjectId: true,
          students: {
            select: {
              id: true,
              name: true,
              curricullumId: true,
            },
          },
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
