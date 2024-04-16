import { PrismaService } from '../../../shared/services/prisma.service';

export async function createSubjects(
  prisma: PrismaService,
  subjectNames: string[],
) {
  return await Promise.all(
    subjectNames.map((name) => prisma.subject.create({ data: { name } })),
  );
}
