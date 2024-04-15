import { PrismaService } from '../../../src/shared/services/prisma.service';

export function findAllStudents(prisma: PrismaService) {
  return prisma.student.findMany();
}

export function findAllCurricullums(prisma: PrismaService) {
  return prisma.curricullum.findMany();
}

export function findAllSubjects(prisma: PrismaService) {
  return prisma.subject.findMany();
}
