import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CurricullumDto } from './dto/curricullum.dto';

@Injectable()
export class CurricullumService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    try {
      return await this.prisma.curricullum.findMany();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      return await this.prisma.curricullum.findUnique({
        where: { id: id },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async create(subjectIds: number[]): Promise<any> {
    try {
      const curricullum = await this.prisma.curricullum.create({});

      await this.prisma.curricullumSubject.createMany({
        data: subjectIds.map((subjectId) => {
          return {
            curricullumId: curricullum.id,
            subjectId: subjectId,
          };
        }),
      });

      return curricullum;
    } catch (err) {
      throw new Error(err);
    }
  }

  async addSubject(curricullumDto: CurricullumDto) {
    try {
      return await this.prisma.curricullumSubject.create({
        data: {
          curricullumId: curricullumDto.curricullumId,
          subjectId: curricullumDto.subjectId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async findSubjectsByCurricullumId(curricullumId: number): Promise<any> {
    try {
      return await this.prisma.curricullumSubject.findMany({
        where: {
          curricullumId: curricullumId,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
