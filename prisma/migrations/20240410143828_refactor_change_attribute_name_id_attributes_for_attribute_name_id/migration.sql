/*
  Warnings:

  - You are about to drop the column `curricullum_id` on the `curricullum_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `curricullum_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `student_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `student_subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[curricullumId]` on the table `curricullum_subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectId]` on the table `curricullum_subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `curricullumId` to the `curricullum_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `curricullum_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `student_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `student_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `curricullum_subjects` DROP FOREIGN KEY `curricullum_subjects_curricullum_id_fkey`;

-- DropForeignKey
ALTER TABLE `curricullum_subjects` DROP FOREIGN KEY `curricullum_subjects_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_subjects` DROP FOREIGN KEY `student_subjects_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_subjects` DROP FOREIGN KEY `student_subjects_subject_id_fkey`;

-- AlterTable
ALTER TABLE `curricullum_subjects` DROP COLUMN `curricullum_id`,
    DROP COLUMN `subject_id`,
    ADD COLUMN `curricullumId` INTEGER NOT NULL,
    ADD COLUMN `subjectId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student_subjects` DROP COLUMN `student_id`,
    DROP COLUMN `subject_id`,
    ADD COLUMN `studentId` INTEGER NOT NULL,
    ADD COLUMN `subjectId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `curricullum_subjects_curricullumId_key` ON `curricullum_subjects`(`curricullumId`);

-- CreateIndex
CREATE UNIQUE INDEX `curricullum_subjects_subjectId_key` ON `curricullum_subjects`(`subjectId`);

-- AddForeignKey
ALTER TABLE `curricullum_subjects` ADD CONSTRAINT `curricullum_subjects_curricullumId_fkey` FOREIGN KEY (`curricullumId`) REFERENCES `curricullums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `curricullum_subjects` ADD CONSTRAINT `curricullum_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_subjects` ADD CONSTRAINT `student_subjects_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_subjects` ADD CONSTRAINT `student_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
