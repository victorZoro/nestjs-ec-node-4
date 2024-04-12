import { getRandomSubjects } from './generateRandomSubjects.helper';

export async function getCurricullumSubjects(curricullums) {
  console.log('[seed.ts] getCurricullumSubjects started...');

  const curricullumSubjects = (
    await Promise.all(
      curricullums.map(async (curricullum) => {
        const subjectsForCurricullum = await getRandomSubjects(5);
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
