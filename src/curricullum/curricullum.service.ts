import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CurricullumDto } from './dto/curricullum.dto';

@Injectable()
export class CurricullumService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return await this.prisma.curricullums.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return await this.prisma.curricullums.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create() {
    try {
      return await this.prisma.curricullums.create({});
    } catch (err) {
      throw new Error(err);
    }
  }

  async addSubject(curricullumDto: CurricullumDto) {
    try {
      return await this.prisma.curricullum_subjects.create({
        data: {
          curricullumId: curricullumDto.curricullumId,
          subjectId: curricullumDto.subjectId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
