import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    return this.prisma.students.findMany();
  }
}
