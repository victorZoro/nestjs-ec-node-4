import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}
  @Get()
  findAll(): Promise<any> {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<any> {
    return this.studentService.findOne(Number(params.id));
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto): Promise<any> {
    return this.studentService.create(createStudentDto);
  }
}
