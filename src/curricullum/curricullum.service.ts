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

    return { curricullum, subjects: curricullum.subjects };
  }

  async create(subjectIds: number[]): Promise<any> {
    this.validateSubjectCount(subjectIds, 5);

    return this.prisma.curricullum.create({
      data: {
        subjects: {
          createMany: {
            data: subjectIds.map((subjectId) => ({
              subjectId: subjectId,
            })),
          },
        },
      },
      include: {
        subjects: {
          select: {
            id: true,
            subjectId: true,
          },
        },
      },
    });
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
          curricullums: {
            connect: { id: curricullumDto.curricullumId },
          },
          subjects: {
            connect: { id: curricullumDto.subjectId },
          },
        },
      });
    } catch (error) {
      throw new BusinessRuleException('Subject not added to curricullum');
    }
  }
}
