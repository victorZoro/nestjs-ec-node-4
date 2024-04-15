-- DropForeignKey
ALTER TABLE `CurricullumSubject` DROP FOREIGN KEY `CurricullumSubject_curricullumId_fkey`;

-- DropForeignKey
ALTER TABLE `CurricullumSubject` DROP FOREIGN KEY `CurricullumSubject_subjectId_fkey`;

-- DropForeignKey
ALTER TABLE `Grade` DROP FOREIGN KEY `Grade_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `Grade` DROP FOREIGN KEY `Grade_subjectId_fkey`;

-- AddForeignKey
ALTER TABLE `CurricullumSubject` ADD CONSTRAINT `CurricullumSubject_curricullumId_fkey` FOREIGN KEY (`curricullumId`) REFERENCES `Curricullum`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CurricullumSubject` ADD CONSTRAINT `CurricullumSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
