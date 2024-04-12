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

    const gradePromises = curriculumSubjects.map(async (curriculumSubject) => {
      const subject = allSubjects.find(
        (subject) => subject.id === curriculumSubject.subjectId,
      );

      if (!subject) return [];

      const numGrades = Math.floor(Math.random() * values.length);

      const grades = Array.from({ length: numGrades }, (_, i) => ({
        value: values[i % values.length],
        subjectId: subject.id,
        studentId: student.id,
      }));

      return prisma.grade.createMany({ data: grades });
    });

    return Promise.all(gradePromises);
  });

  await Promise.all(studentPromises);

  console.log('[seed.ts] seedGrades shutting down...');
}
