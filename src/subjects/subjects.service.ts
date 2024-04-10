import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return await this.prisma.subjects.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return this.prisma.subjects.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(createSubjectDto: CreateSubjectDto) {
    try {
      return this.prisma.subjects.create({
        data: {
          name: createSubjectDto.name,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}