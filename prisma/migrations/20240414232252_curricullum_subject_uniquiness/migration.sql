/*
  Warnings:

  - A unique constraint covering the columns `[subjectId,curricullumId]` on the table `CurricullumSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CurricullumSubject_subjectId_curricullumId_key` ON `CurricullumSubject`(`subjectId`, `curricullumId`);
