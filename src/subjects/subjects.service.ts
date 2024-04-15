import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { BusinessRuleException } from '../shared/helper/businessRuleException.helper';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    const subjects = await this.prisma.subject.findMany();

    if (!subjects) {
      throw new BusinessRuleException('There are no subjects');
    }

    return subjects;
  }

  async findOne(id: number): Promise<any> {
    const subject = await this.prisma.subject.findUnique({
      where: { id: id },
    });

    if (!subject) {
      throw new BusinessRuleException('Subject not found');
    }

    return subject;
  }

  async create(createSubjectDto: CreateSubjectDto) {
    if (!createSubjectDto.name) {
      throw new BusinessRuleException('Name not found');
    }

    const subject = this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
      },
    });

    if (!subject) {
      throw new BusinessRuleException('Subject not created');
    }

    return subject;
  }

  async findCurricullumBySubjectId(subjectId: number): Promise<any> {
    await this.findOne(subjectId);

    const curricullums = await this.prisma.curricullumSubject.findMany({
      where: {
        subjectId: subjectId,
      },
      select: {
        curricullumId: true,
      },
    });

    if (!curricullums || curricullums.length === 0) {
      throw new BusinessRuleException('Curricullums not found');
    }

    return curricullums;
  }
}
