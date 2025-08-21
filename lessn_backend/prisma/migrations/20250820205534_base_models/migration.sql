/*
  Warnings:

  - You are about to drop the column `userId` on the `lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lesson` DROP FOREIGN KEY `Lesson_userId_fkey`;

-- DropIndex
DROP INDEX `Lesson_userId_fkey` ON `lesson`;

-- AlterTable
ALTER TABLE `lesson` DROP COLUMN `userId`,
    ADD COLUMN `grade` VARCHAR(64) NULL,
    ADD COLUMN `ownerId` INTEGER NULL,
    ADD COLUMN `pptxUrl` VARCHAR(512) NULL,
    ADD COLUMN `slidesJson` JSON NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'GENERATING', 'READY', 'FAILED') NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN `subject` VARCHAR(64) NULL,
    ADD COLUMN `thumbnailUrl` VARCHAR(512) NULL,
    ADD COLUMN `topic` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `name` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `LibraryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `extId` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `grade` VARCHAR(64) NULL,
    `subject` VARCHAR(64) NULL,
    `topic` VARCHAR(191) NULL,
    `subTopic` VARCHAR(191) NULL,
    `summary` TEXT NULL,
    `thumbUrl` VARCHAR(512) NULL,
    `viewUrl` VARCHAR(512) NULL,
    `pptxUrl` VARCHAR(512) NULL,
    `pdfUrl` VARCHAR(512) NULL,
    `slidesUrl` VARCHAR(512) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDesc` VARCHAR(512) NULL,
    `rating` DOUBLE NULL DEFAULT 0,
    `reviews` INTEGER NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LibraryItem_extId_key`(`extId`),
    UNIQUE INDEX `LibraryItem_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lesson` ADD CONSTRAINT `Lesson_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
