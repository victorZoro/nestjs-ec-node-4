import { prisma } from '../../seed';

export async function cleanDatabase() {
  console.log('[seed.ts] cleanDatabase() started...');

  const models = ['curricullumSubject', 'subject', 'student', 'curricullum'];

  try {
    for (const model of models) {
      await prisma[model].deleteMany();
      await prisma.$executeRaw`ALTER TABLE ${model} AUTO_INCREMENT = 1;`;
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    console.log('[seed.ts] cleanDatabase() shutting down...');
  }
}
