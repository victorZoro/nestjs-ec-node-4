import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

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

  async findGradeBySubjectId(
    studentId: number,
    subjectId: number,
  ): Promise<any> {
    try {
      return await this.prisma.grade.findMany({
        where: {
          studentId: studentId,
          subjectId: subjectId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async addGrade(studentId: number, subjectId: number, value: number) {
    try {
      return await this.prisma.grade.create({
        data: {
          studentId: studentId,
          subjectId: subjectId,
          value: value,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateGradeByGrade(gradeId: number, value: number) {
    try {
      return await this.prisma.grade.update({
        where: {
          id: gradeId,
        },
        data: {
          value: value,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateGradeByStudentAndSubject(
    studentId: number,
    subjectId: number,
    value: number,
  ) {
    try {
      return await this.prisma.grade.update({
        where: {
          studentId_subjectId: {
            studentId: studentId,
            subjectId: subjectId,
          },
        },
        data: {
          value: value,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
