import { prisma } from '../../seed';

export function findAllStudents() {
  return prisma.student.findMany();
}

export function findAllCurricullums() {
  return prisma.curricullum.findMany();
}

export function findAllSubjects() {
  return prisma.subject.findMany();
}
