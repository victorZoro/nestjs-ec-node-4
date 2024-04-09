import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    return this.prisma.subjects.findMany();
  }

  async findOne(id: number): Promise<any> {
    return this.prisma.subjects.findUnique({
      where: { id: id },
    });
  }

  async create(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subjects.create({
      data: {
        name: createSubjectDto.name,
      },
    });
  }
}
