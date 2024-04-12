import { Prisma } from '@prisma/client';

export interface Student {
  id: number;
  name: string;
  curricullumId: number;
}

export interface StudentWithAverage
  extends Prisma.StudentGetPayload<{ include: { grades: true } }> {
  avgGrade?: number;
}
