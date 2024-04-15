import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { BusinessRuleException } from '../shared/helper/businessRuleException.helper';

//TODO: update create-subject.dto.ts to subject.dto
@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    const subjects = await this.prisma.subject.findMany();

    if (!subjects || subjects.length === 0) {
      throw new BusinessRuleException('There are no subjects');
    }

    return subjects;
  }

  async findOne(subjectId: number): Promise<any> {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
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

  async delete(subjectId: number) {
    const subject = await this.prisma.subject.delete({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new BusinessRuleException('Subject not found');
    }

    return subject;
  }

  async update(subjectId: number, createSubjectDto: CreateSubjectDto) {
    await this.findOne(subjectId);

    if (!createSubjectDto.name) {
      throw new BusinessRuleException('Name not found');
    }

    return this.prisma.subject.update({
      where: { id: subjectId },
      data: {
        name: createSubjectDto.name,
      },
    });
  }
}
