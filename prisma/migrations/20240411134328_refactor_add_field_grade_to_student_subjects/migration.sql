/*
  Warnings:

  - Added the required column `grade` to the `student_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student_subjects` ADD COLUMN `grade` DOUBLE NOT NULL;
