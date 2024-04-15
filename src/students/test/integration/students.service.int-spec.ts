import { StudentsModule } from '../../students.module';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../shared/services/prisma.service';

describe('Students Int', () => {
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [StudentsModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    await prisma.cleanDatabase();
  });
  it.todo('should pass');
});
