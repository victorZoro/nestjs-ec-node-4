//TODO: REMOVE LATER
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const curricullums = Array(4).fill(undefined);

const students = [
  {
    name: 'Alice Thompson',
    curricullumId: 1,
  },
  {
    name: 'Bob Williams',
    curricullumId: 2,
  },
  {
    name: 'Charlie Johnson',
    curricullumId: 3,
  },
  {
    name: 'Diana Miller',
    curricullumId: 4,
  },
  {
    name: 'Ethan Davis',
    curricullumId: 1,
  },
  {
    name: 'Fiona Wilson',
    curricullumId: 3,
  },
  {
    name: 'George Anderson',
    curricullumId: 1,
  },
  {
    name: 'Hannah Taylor',
    curricullumId: 2,
  },
  {
    name: 'Ivan Thomas',
    curricullumId: 4,
  },
  {
    name: 'Julia Jackson',
    curricullumId: 4,
  },
];

const subjects = [
  {
    name: 'Math',
  },
  {
    name: 'Science',
  },
  {
    name: 'History',
  },
  {
    name: 'English',
  },
  {
    name: 'Geography',
  },
  {
    name: 'Art',
  },
  {
    name: 'Music',
  },
  {
    name: 'Physical Education',
  },
  {
    name: 'Computer Science',
  },
  {
    name: 'Health',
  },
];

const grades = [
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 40) + 61),
  ...Array.from({ length: 15 }, () => Math.floor(Math.random() * 100) + 1),
];

async function getRandomSubjects(min: number) {
  console.log('[seed.ts] getRandomSubjects started...');

  const subjects = await prisma.subjects.findMany();
  const shuffled = subjects.sort(() => 0.5 - Math.random());
  const result = [];

  while (result.length < min) {
    const randomIndex = Math.floor(Math.random() * subjects.length);
    result.push(subjects[randomIndex]);
    subjects.splice(randomIndex, 1);
  }

  console.log('[seed.ts] getRandomSubjects shutting down...', result);

  return result;
}

async function getCurricullumSubjects(curricullums) {
  console.log('[seed.ts] getCurricullumSubjects started...');

  const curricullumSubjectsPromises = curricullums.flatMap(
    async (curricullum) => {
      const subjectsForCurricullum = await getRandomSubjects(5);
      return subjectsForCurricullum.map((subject) => ({
        curricullumId: curricullum.id,
        subjectId: subject.id,
      }));
    },
  );

  const curricullumSubjects = (
    await Promise.all(curricullumSubjectsPromises)
  ).flat();

  console.log(
    '[seed.ts] getCurricullumSubjects shutting down...',
    curricullumSubjects,
  );

  return curricullumSubjects;
}

async function findAllStudents() {
  return await prisma.students.findMany();
}

async function findAllCurricullums() {
  return await prisma.curricullums.findMany();
}

async function seedDatabase() {
  console.log('[seed.ts] seedDatabase() started...');

  try {
    // Create subjects
    await Promise.all(
      subjects.map(async (subject) => {
        await prisma.subjects.create({
          data: subject,
        });
      }),
    );

    //Create curriculums
    await Promise.all(
      curricullums.map(async () => {
        await prisma.curricullums.create({
          data: {},
        });
      }),
    );

    //Create students
    await Promise.all(
      students.map(async (student) => {
        await prisma.students.create({
          data: student,
        });
      }),
    );

    const createdCurricullums = await findAllCurricullums();
    const curricullumSubjects =
      await getCurricullumSubjects(createdCurricullums);

    //Create curricullum subjects
    await Promise.all(
      curricullumSubjects.map(async (curricullumSubject) => {
        await prisma.curricullum_subjects.create({
          data: curricullumSubject,
        });
      }),
    );

    const createdStudents = await findAllStudents();

    await Promise.all(
      createdStudents.map(async (student) => {
        const subjectsForStudent = curricullumSubjects.filter(
          (cs) => cs.curricullumId === student.curricullumId,
        );

        await Promise.all(
          subjectsForStudent.map(async (curricullumSubject) => {
            await prisma.student_subjects.create({
              data: {
                studentId: student.id,
                subjectId: curricullumSubject.subjectId,
                grade: grades[Math.floor(Math.random() * grades.length)],
              },
            });
          }),
        );
      }),
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    prisma.$disconnect();
  }
}

seedDatabase();
