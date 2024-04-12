import { prisma } from '../../seed';

export async function deleteAllData() {
  const models = [
    'Grade',
    'CurricullumSubject',
    'Student',
    'Subject',
    'Curricullum',
  ];

  try {
    for (const model of models) {
      await prisma[model].deleteMany();
    }
    console.log('All data deleted successfully');
  } catch (error) {
    console.error('Error deleting data: ', error);
  } finally {
    await prisma.$disconnect();
  }
}
