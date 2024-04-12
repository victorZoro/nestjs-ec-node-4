import { prisma } from '../seed';
import { Student, Subject } from '@prisma/client';

const values = [
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 40) + 61),
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1),
];

export async function seedGrades(
  allStudents: Student[],
  allSubjects: Subject[],
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

    const gradePromises = curriculumSubjects.map(async (curriculumSubject) => {
      const subject = allSubjects.find(
        (subject) => subject.id === curriculumSubject.subjectId,
      );

      console.log(
        `[seed.ts] subject for curriculumSubject ${curriculumSubject.id}:`,
        subject,
      );

      if (!subject) return [];

      const gradeValue = values[Math.floor(Math.random() * values.length)];

      const grade = {
        value: gradeValue,
        subjectId: subject.id,
        studentId: student.id,
      };

      const existingGrade = await prisma.grade.findFirst({
        where: { studentId: student.id, subjectId: subject.id },
      });

      console.log(
        `[seed.ts] existingGrade for student ${student.id} and subject ${subject.id}:`,
        existingGrade,
      );

      if (existingGrade) {
        return prisma.grade.update({
          where: { id: existingGrade.id },
          data: { value: gradeValue },
        });
      } else {
        return prisma.grade.create({
          data: grade,
        });
      }
    });

    return Promise.all(gradePromises);
  });

  await Promise.all(studentPromises);

  console.log('[seed.ts] seedGrades shutting down...');
}
