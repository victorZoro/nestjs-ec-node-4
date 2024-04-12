import { PrismaClient } from '@prisma/client';
import { subjects } from './seeding/subjects.seed';
import { students } from './seeding/students.seed';
import { getCurricullumSubjects } from './seeding/helper/generateCurricullumSubjects.helper';
import {
  findAllCurricullums,
  findAllStudents,
  findAllSubjects,
} from './seeding/helper/findAll.helper';
import * as process from 'process';
import { seedGrades } from './seeding/grades.seed';

export const prisma = new PrismaClient();

async function seedSubjects() {
  console.log('[seed.ts] seedSubjects() started...');

  try {
    await Promise.all(
      subjects.map(async (subject) => {
        await prisma.subject.create({
          data: subject,
        });
      }),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    console.log('[seed.ts] seedSubjects() shutting down...');
  }
}
async function seedCurricullums() {
  console.log('[seed.ts] seedCurriculums() started...');

  const curricullums = Array(4).fill(undefined);

  try {
    await Promise.all(
      curricullums.map(async () => {
        await prisma.curricullum.create({
          data: {},
        });
      }),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    console.log('[seed.ts] seedCurriculums() shutting down...');
  }
}

async function seedStudents() {
  console.log('[seed.ts] seedStudents() started...');

  try {
    await Promise.all(
      students.map(async (student) => {
        await prisma.student.create({
          data: student,
        });
      }),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    console.log('[seed.ts] seedStudents() shutting down...');
  }
}

async function seedCurricullumSubjects(allCurricullums: any) {
  try {
    const curricullumSubjects = await getCurricullumSubjects(allCurricullums);

    await Promise.all(
      curricullumSubjects.map(async (curricullumSubject) => {
        await prisma.curricullumSubject.create({
          data: curricullumSubject,
        });
      }),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    console.log('[seed.ts] seedCurricullumSubjects() shutting down...');
  }
}

async function findAll() {
  const allCurricullums = await findAllCurricullums();
  const allStudents = await findAllStudents();
  const allSubjects = await findAllSubjects();

  return { allCurricullums, allStudents, allSubjects };
}

async function main() {
  console.log('[seed.ts] seedDatabase() started...');

  try {
    await seedCurricullums();
    await seedSubjects();
    await seedStudents();

    const { allCurricullums, allStudents, allSubjects } = await findAll();

    await seedCurricullumSubjects(allCurricullums);

    await seedGrades(allStudents, allSubjects);

    console.log('[seed.ts] seedDatabase() ended...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    prisma.$disconnect();
  }
}

main();
