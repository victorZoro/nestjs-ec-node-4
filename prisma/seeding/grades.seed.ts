import { Student, Subject } from '@prisma/client';
import { PrismaService } from '../../src/shared/services/prisma.service';

const values = [
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 40) + 61),
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1),
];

export async function seedGrades(
  prisma: PrismaService,
  allStudents: Student[],
  allSubjects: Subject[],
  numGradesPerSubject: number,
) {
  console.log('[seed.ts] seedGrades started...');

  const studentPromises = allStudents.map(async (student) => {
    const curriculumSubjects = await prisma.curricullumSubject.findMany({
      where: { curricullumId: student.curricullumId },
    });

    console.log(
      `[seed.ts] curriculumSubjects for student ${student.id}:`,
      curriculumSubjects,
    );

    const gradePromises = curriculumSubjects.flatMap((curriculumSubject) => {
      const subject = allSubjects.find(
        (subject) => subject.id === curriculumSubject.subjectId,
      );

      console.log(
        `[seed.ts] subject for curriculumSubject ${curriculumSubject.id}:`,
        subject,
      );

      if (!subject) return [];

      const grades = [];

      for (let i = 0; i < numGradesPerSubject; i++) {
        const gradeValue = values[Math.floor(Math.random() * values.length)];

        const grade = {
          value: gradeValue,
          subjectId: subject.id,
          studentId: student.id,
        };

        grades.push(
          prisma.grade.create({
            data: grade,
          }),
        );
      }

      return grades;
    });

    return Promise.all(gradePromises);
  });

  await Promise.all(studentPromises);

  console.log('[seed.ts] seedGrades shutting down...');
}
