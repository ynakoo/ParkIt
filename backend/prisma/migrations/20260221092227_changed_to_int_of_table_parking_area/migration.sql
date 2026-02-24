/*
  Warnings:

  - You are about to drop the column `status` on the `ParkingArea` table. All the data in the column will be lost.
  - Made the column `managerId` on table `ParkingArea` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ParkingArea` DROP FOREIGN KEY `ParkingArea_managerId_fkey`;

-- AlterTable
ALTER TABLE `ParkingArea` DROP COLUMN `status`,
    MODIFY `managerId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Manager` (
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParkingArea` ADD CONSTRAINT `ParkingArea_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
