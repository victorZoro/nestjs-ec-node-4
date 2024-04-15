import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { isSubjectCompleted } from '../shared/helper/isSubjectCompleted.helper';
import { GradeDto } from '../shared/dto/grade.dto';
import { BusinessRuleException } from '../shared/helper/businessRuleException.helper';

//TODO: Refactor to use repositories
//TODO: Add update and delete student methods
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<any> {
    const students = await this.prisma.student.findMany();

    if (!students) {
      throw new BusinessRuleException('Students not found');
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

  async findAllGrades(studentId: number): Promise<any> {
    const grades = this.prisma.grade.findMany({
      where: {
        studentId: studentId,
      },
      select: {
        id: true,
        studentId: true,
        subjectId: true,
        value: true,
      },
    });

    if (!grades) {
      throw new BusinessRuleException('Student not found');
    }

    return grades;
  }

  async findGradeBySubjectId(gradeDto: GradeDto): Promise<any> {
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
    if (await isSubjectCompleted(this.prisma, gradeDto)) {
      throw new Error(
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

  async updateGrade(gradeDto: GradeDto) {
    if (!gradeDto.gradeId) {
      throw new BusinessRuleException('Grade Id is required');
    }

    if (!gradeDto.value) {
      throw new BusinessRuleException('Grade value is required');
    }

    return this.prisma.grade.update({
      where: {
        id: gradeDto.gradeId,
      },
      data: {
        value: gradeDto.value,
      },
    });
  }

  async findAllRecords() {
    const records = this.prisma.grade.findMany({
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
      throw new BusinessRuleException('Grades not found');
    }

    return records;
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
}
