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
import { CreateCurricullumDto } from './dto/create-curricullum.dto';

@Controller('curricullums')
export class CurricullumController {
  constructor(private readonly curricullumService: CurricullumService) {}
  @Get()
  async findAll(@Res() res: Response): Promise<any> {
    try {
      const curricullum = this.curricullumService.findAll();
      res.status(HttpStatus.OK).json(curricullum);
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

  @Post()
  async create(
    @Body() createCurricullumDto: CreateCurricullumDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const curricullum =
        await this.curricullumService.create(createCurricullumDto);
      res.status(HttpStatus.OK).send(curricullum);
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    }
  }
}
