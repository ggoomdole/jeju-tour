/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pilgrimage` DROP FOREIGN KEY `Pilgrimage_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `pilgrimagespot` DROP FOREIGN KEY `PilgrimageSpot_pilgrimageId_fkey`;

-- DropForeignKey
ALTER TABLE `pilgrimagespot` DROP FOREIGN KEY `PilgrimageSpot_spotId_fkey`;

-- DropForeignKey
ALTER TABLE `pilgrimageuser` DROP FOREIGN KEY `PilgrimageUser_pilgrimageId_fkey`;

-- DropForeignKey
ALTER TABLE `pilgrimageuser` DROP FOREIGN KEY `PilgrimageUser_userId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_spotId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_userId_fkey`;

-- DropForeignKey
ALTER TABLE `searchkeyword` DROP FOREIGN KEY `SearchKeyword_userId_fkey`;

-- DropIndex
DROP INDEX `Pilgrimage_categoryId_fkey` ON `pilgrimage`;

-- DropIndex
DROP INDEX `PilgrimageSpot_spotId_fkey` ON `pilgrimagespot`;

-- DropIndex
DROP INDEX `PilgrimageUser_pilgrimageId_fkey` ON `pilgrimageuser`;

-- DropIndex
DROP INDEX `Review_spotId_fkey` ON `review`;

-- DropIndex
DROP INDEX `Review_userId_fkey` ON `review`;

-- DropIndex
DROP INDEX `SearchKeyword_userId_fkey` ON `searchkeyword`;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `imageUrl`,
    MODIFY `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ReviewImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reviewId` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SearchKeyword` ADD CONSTRAINT `SearchKeyword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_spotId_fkey` FOREIGN KEY (`spotId`) REFERENCES `Spot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewImage` ADD CONSTRAINT `ReviewImage_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilgrimageSpot` ADD CONSTRAINT `PilgrimageSpot_pilgrimageId_fkey` FOREIGN KEY (`pilgrimageId`) REFERENCES `Pilgrimage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilgrimageSpot` ADD CONSTRAINT `PilgrimageSpot_spotId_fkey` FOREIGN KEY (`spotId`) REFERENCES `Spot`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilgrimageUser` ADD CONSTRAINT `PilgrimageUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PilgrimageUser` ADD CONSTRAINT `PilgrimageUser_pilgrimageId_fkey` FOREIGN KEY (`pilgrimageId`) REFERENCES `Pilgrimage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pilgrimage` ADD CONSTRAINT `Pilgrimage_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
