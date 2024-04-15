import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CurricullumDto } from './dto/curricullum.dto';
import { BusinessRuleException } from '../shared/helper/businessRuleException.helper';

//TODO: Refactor to use repositories
//TODO: Add update and delete curricullum methods
@Injectable()
export class CurricullumService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    const curricullums = await this.prisma.curricullum.findMany({
      include: {
        subjects: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    if (!curricullums) {
      throw new BusinessRuleException('There are no curriculums.');
    }

    return curricullums;
  }

  async findOne(curricullumId: number): Promise<any> {
    const curricullum = await this.prisma.curricullum.findUnique({
      where: {
        id: curricullumId,
      },
      include: {
        subjects: {
          select: {
            subjectId: true,
          },
        },
      },
    });

    if (!curricullum) {
      throw new BusinessRuleException('Curricullum not found');
    }

    return curricullum;
  }

  async create(subjectIds: number[]): Promise<any> {
    try {
      this.validateSubjectCount(subjectIds, 5);

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

  validateSubjectCount(subjectIds: number[], minimum: number): void {
    if (subjectIds.length < minimum) {
      throw new Error('Minimum subject count is not met');
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
}
