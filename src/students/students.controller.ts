import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Response } from 'express';
import { GradeDto } from '../shared/dto/grade.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    const students = await this.studentService.findAll();
    res.status(HttpStatus.OK).json(students);
  }

  @Get('best')
  async findAllByScore(@Res() res: Response): Promise<void> {
    const students = await this.studentService.findAllByScore();
    res.status(HttpStatus.OK).json(students);
  }

  @Get('records')
  async findAllRecords(@Res() res: Response): Promise<void> {
    const records = await this.studentService.findAllRecords();
    res.status(HttpStatus.OK).send(records);
  }

  @Get('records/:id')
  async findRecordsByStudent(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<void> {
    const record = await this.studentService.findRecordsByStudent(
      Number(params.id),
    );
    res.status(HttpStatus.OK).send(record);
  }

  @Get(':id')
  async findOne(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<void> {
    const student = await this.studentService.findOne(Number(params.id));
    res.status(HttpStatus.OK).send(student);
  }

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() res: Response,
  ): Promise<void> {
    const student = await this.studentService.create(createStudentDto);
    res.status(HttpStatus.OK).send(student);
  }

  @Get(':id/grades')
  async findAllGrades(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<void> {
    const grades = await this.studentService.findAllGrades(Number(params.id));
    res.status(HttpStatus.OK).send(grades);
  }

  @Get(':studentId/grades/:subjectId')
  async findGradeBySubjectId(
    @Param() params: GradeDto,
    @Res() res: Response,
  ): Promise<void> {
    const grade = await this.studentService.findGradeBySubjectId(params);
    res.status(HttpStatus.OK).send(grade);
  }

  @Post('grades/add')
  async addGrade(
    @Body() gradeDto: GradeDto,
    @Res() res: Response,
  ): Promise<void> {
    const grade = await this.studentService.addGrade(gradeDto);
    res.status(HttpStatus.OK).send(grade);
  }

  @Post('grades/update')
  async updateGrade(
    @Body() gradeDto: GradeDto,
    @Res() res: Response,
  ): Promise<void> {
    const grade = await this.studentService.updateGrade(gradeDto);

    res.status(HttpStatus.OK).send(grade);
  }
}
