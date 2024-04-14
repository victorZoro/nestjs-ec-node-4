import { GradeDto } from '../dto/grade.dto';

export async function isSubjectCompleted(gradeDto: GradeDto) {
  const grades: any[] = await this.prisma.grade.findMany({
    where: {
      studentId: gradeDto.studentId,
      subjectId: gradeDto.subjectId,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (grades.length % 3 !== 0) {
    return false;
  }

  const lastGrades = grades.slice(0, 3);

  return lastGrades.every((grade) => grade.value > 80);
}
