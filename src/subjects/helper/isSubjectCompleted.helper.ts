export async function isSubjectCompleted(studentId: number, subjectId: number) {
  const grades = await this.prisma.grade.findMany({
    where: {
      studentId: studentId,
      subjectId: subjectId,
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
