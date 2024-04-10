import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return this.prisma.students.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return this.prisma.students.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(createStudentDto: CreateStudentDto) {
    try {
      return this.prisma.students.create({
        data: {
          name: createStudentDto.name,
          curricullumId: createStudentDto.curricullumId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
