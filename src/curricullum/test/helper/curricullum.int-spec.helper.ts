import { PrismaService } from '../../../shared/services/prisma.service';

export function getDefaultSubjectNames() {
  return ['subject1', 'subject2', 'subject3', 'subject4', 'subject5'];
}

export async function createCurricullum(
  prisma: PrismaService,
  subjectIds: number[],
) {
  return prisma.curricullum.create({
    data: {
      subjects: {
        createMany: {
          data: subjectIds.map((subjectId) => ({
            subjectId: subjectId,
          })),
        },
      },
    },
    include: {
      subjects: {
        select: {
          subjectId: true,
        },
      },
    },
  });
}
