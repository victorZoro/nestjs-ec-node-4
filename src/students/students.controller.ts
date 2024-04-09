import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentService: StudentsService) {}
  @Get()
  findAll(): Promise<any> {
    return this.studentService.findAll();
  }
}
