import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { isSubjectCompleted } from '../shared/helper/isSubjectCompleted.helper';
import { GradeDto } from '../shared/dto/grade.dto';
import { BusinessRuleException } from '../shared/helper/businessRuleException.helper';

//TODO: Refactor to use repositories
//TODO: update create-student.dto.ts to student.dto
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    const students = await this.prisma.student.findMany();

    if (!students || students.length === 0) {
      throw new BusinessRuleException('There are no students');
    }

    return students;
  }

  async findOne(id: number): Promise<any> {
    const student = await this.prisma.student.findUnique({
      where: { id: id },
    });

    if (!student) {
      throw new BusinessRuleException('Student not found');
    }

    return student;
  }
  async findAllByScore(): Promise<any> {
    await this.findAll();

    return this.prisma.$queryRaw`
        SELECT students.*,
               (SELECT AVG(value) FROM Grade WHERE studentId = students.id) as avgGrade
        FROM Student students
        ORDER BY avgGrade DESC
    `;
  }

  async create(createStudentDto: CreateStudentDto) {
    if (!createStudentDto.name || !createStudentDto.curricullumId) {
      throw new BusinessRuleException('Name or curricullumId not found');
    }

    return this.prisma.student.create({
      data: {
        name: createStudentDto.name,
        curricullumId: createStudentDto.curricullumId,
      },
    });
  }

  async findStudentGradesBySubjectId(gradeDto: GradeDto): Promise<any> {
    await this.findOne(Number(gradeDto.studentId));
    await this.findOneSubject(Number(gradeDto.subjectId));

    const grade = this.prisma.grade.findMany({
      where: {
        studentId: Number(gradeDto.studentId),
        subjectId: Number(gradeDto.subjectId),
      },
      select: {
        id: true,
        studentId: true,
        subjectId: true,
        value: true,
      },
    });

    if (!grade) {
      throw new BusinessRuleException('Grade not found');
    }

    return grade;
  }

  async addGrade(gradeDto: GradeDto) {
    if (!gradeDto.value || gradeDto.value < 0 || gradeDto.value > 100) {
      throw new BusinessRuleException('Invalid grade');
    }

    await this.findOne(gradeDto.studentId);
    await this.findOneSubject(gradeDto.subjectId);

    if (await isSubjectCompleted(this.prisma, gradeDto)) {
      throw new BusinessRuleException(
        'This subject has been completed and cannot accept new grades.',
      );
    }

    const grade = this.prisma.grade.create({
      data: {
        studentId: gradeDto.studentId,
        subjectId: gradeDto.subjectId,
        value: gradeDto.value,
      },
    });

    if (!grade) {
      throw new BusinessRuleException('Grade not found');
    }

    return grade;
  }

  async findOneSubject(subjectId: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      throw new BusinessRuleException('Subject not found');
    }

    return subject;
  }

  async updateGrade(gradeDto: GradeDto) {
    if (!gradeDto.gradeId) {
      throw new BusinessRuleException('Grade Id is required');
    }

    if (!gradeDto.value || gradeDto.value < 0 || gradeDto.value > 100) {
      throw new BusinessRuleException('Invalid grade');
    }

    await this.findOneGrade(gradeDto.gradeId);

    return this.prisma.grade.update({
      where: {
        id: gradeDto.gradeId,
      },
      data: {
        value: gradeDto.value,
      },
    });
  }

  async findOneGrade(gradeId: number) {
    const grade = await this.prisma.grade.findUnique({
      where: { id: gradeId },
    });

    if (!grade) {
      throw new BusinessRuleException('Grade not found');
    }

    return grade;
  }

  async findAllRecords() {
    await this.findAll();

    return this.prisma.grade.findMany({
      select: {
        value: true,
        subjectId: true,
        students: {
          select: {
            id: true,
            name: true,
            curricullumId: true,
          },
        },
      },
    });
  }

  async findRecordsByStudent(studentId: number) {
    await this.findOne(studentId);

    const records = this.prisma.grade.findMany({
      where: {
        studentId: studentId,
      },
      select: {
        value: true,
        subjectId: true,
        students: {
          select: {
            id: true,
            name: true,
            curricullumId: true,
          },
        },
      },
    });

    if (!records) {
      throw new BusinessRuleException('Records not found');
    }

    return records;
  }

  async delete(studentId: number) {
    await this.findOne(studentId);

    return this.prisma.student.delete({
      where: {
        id: studentId,
      },
    });
  }

  async update(studentId: number, createStudentDto: CreateStudentDto) {
    await this.findOne(studentId);

    if (!createStudentDto.name || !createStudentDto.curricullumId) {
      throw new BusinessRuleException('Name or curricullumId not found');
    }

    return this.prisma.student.update({
      where: {
        id: studentId,
      },
      data: {
        name: createStudentDto.name,
        curricullumId: createStudentDto.curricullumId,
      },
    });
  }
}
