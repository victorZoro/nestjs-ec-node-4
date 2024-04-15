import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (err) {
      console.error(err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    console.log('[seed.ts] cleanDatabase() started...');

    const models = ['curricullumSubject', 'subject', 'student', 'curricullum'];

    try {
      for (const model of models) {
        await this[model].deleteMany();
        await this.$executeRaw`ALTER TABLE ${model} AUTO_INCREMENT = 1;`;
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    } finally {
      console.log('[seed.ts] cleanDatabase() shutting down...');
    }
  }
}
