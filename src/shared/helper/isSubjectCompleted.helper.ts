import { GradeDto } from '../dto/grade.dto';
import { PrismaService } from '../services/prisma.service';

export async function isSubjectCompleted(
  prisma: PrismaService,
  gradeDto: GradeDto,
) {
  const grades: any[] = await prisma.grade.findMany({
    where: {
      studentId: gradeDto.studentId,
      subjectId: gradeDto.subjectId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (grades || grades.length % 3 !== 0) {
    return false;
  }

  const lastGrades = grades.slice(0, 3);

  return lastGrades.every((grade) => grade.value > 80);
}
