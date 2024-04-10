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
    try {
      const students = this.studentService.findAll();
      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param() params: any, @Res() res: Response): Promise<any> {
    try {
      const student = await this.studentService.findOne(Number(params.id));
      res.status(HttpStatus.OK).send(student);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const student = await this.studentService.create(createStudentDto);
      res.status(HttpStatus.OK).send(student);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}
