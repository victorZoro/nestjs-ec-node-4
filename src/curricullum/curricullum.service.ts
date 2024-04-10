import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';

@Injectable()
export class CurricullumService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return this.prisma.curricullums.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return this.prisma.curricullums.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create() {
    try {
      return this.prisma.curricullums.create({});
    } catch (err) {
      throw new Error(err);
    }
  }
}
