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
  async findOne(
    @Param() params: any,
    @Res() res: Response,
  ): Promise<any> {
    const student = await this.studentService.findOne(params.id);
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

  @Get(':id/subjects')
  async findAllSubjects(@Param() params: ParamsById, @Res() res: Response) {
    const studentSubjects = await this.studentService.findAllSubjects(
      params.id,
    );
    res.status(HttpStatus.OK).json(studentSubjects);
  }
}
