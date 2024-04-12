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

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}

  @Get()
  async findAll(@Res() res: Response): Promise<any> {
    const students = await this.studentService.findAll();
    res.status(HttpStatus.OK).json(students);
  }

  @Get(':id')
  async findOne(@Param() params: any, @Res() res: Response): Promise<any> {
    const student = await this.studentService.findOne(Number(params.id));
    res.status(HttpStatus.OK).send(student);
  }

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() res: Response,
  ): Promise<any> {
    const student = await this.studentService.create(createStudentDto);
    res.status(HttpStatus.OK).send(student);
  }

  @Get(':id/grades')
  async findAllGrades(
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const grades = await this.studentService.findAllGrades(Number(params.id));
    res.status(HttpStatus.OK).send(grades);
  }

  @Get(':id/grades/:subjectId')
  async findGradeBySubjectId(@Param() params: any, @Res() res: Response) {
    const grade = await this.studentService.findGradeBySubjectId(
      Number(params.id),
      Number(params.subjectId),
    );
    res.status(HttpStatus.OK).send(grade);
  }

  @Post('grades/add')
  async addGrade(@Body() body: any, @Res() res: Response) {
    const grade = await this.studentService.addGrade(
      Number(body.studentId),
      Number(body.subjectId),
      Number(body.value),
    );
    res.status(HttpStatus.OK).send(grade);
  }

  @Post('grades/update')
  async updateGrade(@Body() body: any, @Res() res: Response) {
    const grade = await this.studentService.updateGrade(
      Number(body.gradeId),
      Number(body.value),
    );
    res.status(HttpStatus.OK).send(grade);
  }
}
