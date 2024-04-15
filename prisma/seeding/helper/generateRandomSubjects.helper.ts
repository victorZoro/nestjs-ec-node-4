import { PrismaService } from '../../../src/shared/services/prisma.service';

export async function getRandomSubjects(prisma: PrismaService, min: number) {
  console.log('[seed.ts] getRandomSubjects started...');

  const subjects = await prisma.subject.findMany();
  const result = [];

  while (result.length < min) {
    const randomIndex = Math.floor(Math.random() * subjects.length);
    result.push(subjects[randomIndex]);
    subjects.splice(randomIndex, 1);
  }

  console.log('[seed.ts] getRandomSubjects shutting down...', result);

  return result;
}
