import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { SubjectsModule } from './subjects/subjects.module';
import { CurricullumModule } from './curricullum/curricullum.module';

@Module({
  imports: [StudentsModule, SubjectsModule, CurricullumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
