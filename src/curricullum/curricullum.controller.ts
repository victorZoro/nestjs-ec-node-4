import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CurricullumService } from './curricullum.service';
import { CurricullumDto } from './dto/curricullum.dto';

@Controller('curricullums')
export class CurricullumController {
  constructor(private readonly curricullumService: CurricullumService) {}
  @Get()
  async findAll(@Res() res: Response): Promise<void> {
    try {
      const curricullums = await this.curricullumService.findAll();
      res.status(HttpStatus.OK).json(curricullums);
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
  ): Promise<void> {
    try {
      const curricullum = await this.curricullumService.findOne(
        Number(params.id),
      );
      res.status(HttpStatus.OK).send(curricullum);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }

  //TODO: change verification for existing subjects
  @Post()
  async create(
    @Body() body: { subjectIds: number[] },
    @Res() res: Response,
  ): Promise<void> {
    const curricullum = await this.curricullumService.create(body.subjectIds);
    res.status(HttpStatus.OK).send(curricullum);
  }

  @Post('add')
  async addSubject(
    @Body() curricullumDto: CurricullumDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const curricullum =
        await this.curricullumService.addSubject(curricullumDto);
      res.status(HttpStatus.OK).send(curricullum);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}
