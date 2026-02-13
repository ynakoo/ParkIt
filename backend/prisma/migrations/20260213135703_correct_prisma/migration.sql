/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Ticket` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `Enum(EnumId(3))`.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - The values [user,manager,driver,super_admin] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `DriverAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DriverStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParkingSpace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCar` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[qrCode]` on the table `ParkingArea` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[managerId]` on the table `ParkingArea` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `ParkingArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DriverAssignment` DROP FOREIGN KEY `DriverAssignment_driverId_fkey`;

-- DropForeignKey
ALTER TABLE `DriverAssignment` DROP FOREIGN KEY `DriverAssignment_requestId_fkey`;

-- DropForeignKey
ALTER TABLE `DriverStatus` DROP FOREIGN KEY `DriverStatus_driverId_fkey`;

-- DropForeignKey
ALTER TABLE `ParkingArea` DROP FOREIGN KEY `ParkingArea_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `ParkingRequest` DROP FOREIGN KEY `ParkingRequest_ticketId_fkey`;

-- DropForeignKey
ALTER TABLE `ParkingSpace` DROP FOREIGN KEY `ParkingSpace_parkingAreaId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_ticketId_fkey`;

-- DropForeignKey
ALTER TABLE `SpaceAssignment` DROP FOREIGN KEY `SpaceAssignment_spaceId_fkey`;

-- DropForeignKey
ALTER TABLE `SpaceAssignment` DROP FOREIGN KEY `SpaceAssignment_ticketId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_carId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_parkingAreaId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCar` DROP FOREIGN KEY `UserCar_userId_fkey`;

-- DropIndex
DROP INDEX `Ticket_ticketNumber_key` ON `Ticket`;

-- AlterTable
ALTER TABLE `ParkingArea` ADD COLUMN `amount` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Ticket` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `status` ENUM('REQUESTED', 'DRIVER_ASSIGNED', 'PARKING_STARTED', 'PARKED', 'CAR_ON_THE_WAY', 'COMPLETED') NOT NULL DEFAULT 'REQUESTED',
    ADD PRIMARY KEY (`ticketNumber`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `isActive`,
    DROP COLUMN `phone`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('SUPERADMIN', 'MANAGER', 'DRIVER', 'USER') NOT NULL;

-- DropTable
DROP TABLE `DriverAssignment`;

-- DropTable
DROP TABLE `DriverStatus`;

-- DropTable
DROP TABLE `ParkingRequest`;

-- DropTable
DROP TABLE `ParkingSpace`;

-- DropTable
DROP TABLE `Payment`;

-- DropTable
DROP TABLE `SpaceAssignment`;

-- DropTable
DROP TABLE `UserCar`;

-- CreateTable
CREATE TABLE `Manager` (
    `userId` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `userId` VARCHAR(191) NOT NULL,
    `parkingAreaId` VARCHAR(191) NOT NULL,
    `status` ENUM('AVAILABLE', 'BUSY', 'INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
    `dlNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Driver_dlNumber_key`(`dlNumber`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriverRequest` (
    `id` VARCHAR(191) NOT NULL,
    `requestType` ENUM('PARKING', 'RETRIEVAL') NOT NULL,
    `ticketNo` VARCHAR(191) NOT NULL,
    `driverId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ParkingArea_qrCode_key` ON `ParkingArea`(`qrCode`);

-- CreateIndex
CREATE UNIQUE INDEX `ParkingArea_managerId_key` ON `ParkingArea`(`managerId`);

-- AddForeignKey
ALTER TABLE `Manager` ADD CONSTRAINT `Manager_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParkingArea` ADD CONSTRAINT `ParkingArea_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `Manager`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_parkingAreaId_fkey` FOREIGN KEY (`parkingAreaId`) REFERENCES `ParkingArea`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_parkingAreaId_fkey` FOREIGN KEY (`parkingAreaId`) REFERENCES `ParkingArea`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverRequest` ADD CONSTRAINT `DriverRequest_ticketNo_fkey` FOREIGN KEY (`ticketNo`) REFERENCES `Ticket`(`ticketNumber`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverRequest` ADD CONSTRAINT `DriverRequest_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;
