import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './student.interface';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return await this.prisma.students.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return await this.prisma.students.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      const student = await this.prisma.students.create({
        data: {
          name: createStudentDto.name,
          curricullumId: createStudentDto.curricullumId,
        },
      });

      await this.createStudentSubject(createStudentDto, student);

      return student;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAllSubjects(studentId: number): Promise<any> {
    try {
      return await this.prisma.student_subjects.findMany({
        where: { studentId: studentId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async createStudentSubject(
    createStudentDto: CreateStudentDto,
    student: Student,
  ) {
    try {
      const curricullumSubjects =
        await this.prisma.curricullum_subjects.findMany({
          where: { curricullumId: createStudentDto.curricullumId },
        });

      for (const curricullumSubject of curricullumSubjects) {
        await this.prisma.student_subjects.create({
          data: {
            studentId: student.id,
            subjectId: curricullumSubject.subjectId,
          },
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
