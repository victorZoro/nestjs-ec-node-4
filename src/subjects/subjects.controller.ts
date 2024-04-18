import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Response } from 'express';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}
  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    const subjects = await this.subjectService.findAll();
    res.status(HttpStatus.OK).json(subjects);
  }

  @Put(':id')
  async update(
    @Param() params: { id: number },
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response,
  ): Promise<void> {
    const subject = await this.subjectService.update(
      Number(params.id),
      createSubjectDto,
    );
    res.status(HttpStatus.OK).json(subject);
  }

  @Delete(':id')
  async delete(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<void> {
    const subject = await this.subjectService.delete(Number(params.id));
    res.status(HttpStatus.OK).json(subject);
  }

  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Res() res: Response,
  ): Promise<void> {
    const subject = await this.subjectService.create(createSubjectDto);
    res.status(HttpStatus.OK).json(subject);
  }

  @Get(':id/curricullums')
  async findCurricullumBySubjectId(
    @Param() params: { id: number },
    @Res() res: Response,
  ): Promise<void> {
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
