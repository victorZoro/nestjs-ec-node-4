import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Response } from 'express';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}
  @Get()
  async findAll(@Res() res: Response): Promise<any> {
    try {
      const subjects = await this.subjectService.findAll();
      res.status(HttpStatus.OK).json(subjects);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  @Get(':id')
  async findOne(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const subject = await this.subjectService.findOne(Number(params.id));
      res.status(HttpStatus.OK).json(subject);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const subject = await this.subjectService.create(createSubjectDto);
      res.status(HttpStatus.OK).json(subject);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  @Get(':id/curricullums')
  async findCurricullumBySubjectId(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<any> {
    try {
      const subject = await this.subjectService.findCurricullumBySubjectId(
        Number(params.id),
      );
      res.status(HttpStatus.OK).json(subject);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}
