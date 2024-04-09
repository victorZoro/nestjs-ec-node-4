import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}
  @Get()
  findAll(): Promise<any> {
    return this.subjectService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: any): Promise<any> {
    return this.subjectService.findOne(Number(params.id));
  }

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto): Promise<any> {
    return this.subjectService.create(createSubjectDto);
  }
}
