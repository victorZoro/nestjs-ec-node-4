import * as faker from 'faker';

export function generateStudents(
  curricullums: any[],
  numberOfStudents: number,
) {
  const students = [];

  for (let i = 0; i < numberOfStudents; i++) {
    const name = faker.name.findName();
    const curricullumId =
      curricullums[Math.floor(Math.random() * curricullums.length)].id;

    const student = {
      name,
      curricullumId,
    };

    students.push(student);
  }

  return students;
}
