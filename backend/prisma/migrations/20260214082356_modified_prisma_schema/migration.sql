/*
  Warnings:

  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Manager` DROP FOREIGN KEY `Manager_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ParkingArea` DROP FOREIGN KEY `ParkingArea_managerId_fkey`;

-- AlterTable
ALTER TABLE `ParkingArea` ADD COLUMN `status` ENUM('PENDING', 'ACTIVE') NOT NULL DEFAULT 'PENDING',
    MODIFY `managerId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Manager`;

-- AddForeignKey
ALTER TABLE `ParkingArea` ADD CONSTRAINT `ParkingArea_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
