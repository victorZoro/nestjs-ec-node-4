import { Module } from '@nestjs/common';
import { CurricullumController } from './curricullum.controller';
import { CurricullumService } from './curricullum.service';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [CurricullumController],
  providers: [CurricullumService, PrismaService],
})
export class CurricullumModule {}
