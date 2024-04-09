import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    return this.prisma.students.findMany();
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.students.findUnique({
      where: { id: id },
    });
  }

  async create(createStudentDto: CreateStudentDto) {
    return this.prisma.students.create({
      data: {
        name: createStudentDto.name,
        curricullumId: createStudentDto.curricullumId,
      },
    });
  }
}
