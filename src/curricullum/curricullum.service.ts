import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateCurricullumDto } from './dto/create-curricullum.dto';

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

  async create(createCurricullumDto: CreateCurricullumDto) {
    try {
      return this.prisma.curricullums.create({
        data: {
          name: createCurricullumDto.name,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
