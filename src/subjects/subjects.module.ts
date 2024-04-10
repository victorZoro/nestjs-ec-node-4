import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  imports: [],
  controllers: [SubjectsController],
  providers: [SubjectsService, PrismaService],
})
export class SubjectsModule {}
