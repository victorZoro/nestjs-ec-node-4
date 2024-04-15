import { getRandomSubjects } from './generateRandomSubjects.helper';
import { PrismaService } from '../../../src/shared/services/prisma.service';

export async function getCurricullumSubjects(
  prisma: PrismaService,
  curricullums,
) {
  console.log('[seed.ts] getCurricullumSubjects started...');

  const curricullumSubjects = (
    await Promise.all(
      curricullums.map(async (curricullum) => {
        const subjectsForCurricullum = await getRandomSubjects(prisma, 5);
        return subjectsForCurricullum.map((subject) => ({
          curricullumId: curricullum.id,
          subjectId: subject.id,
        }));
      }),
    )
  ).flat();

  console.log(
    '[seed.ts] getCurricullumSubjects shutting down...',
    curricullumSubjects,
  );

  return curricullumSubjects;
}
