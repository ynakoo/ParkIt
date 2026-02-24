/*
  Warnings:

  - You are about to alter the column `amount` on the `ParkingArea` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `ParkingArea` MODIFY `amount` INTEGER NOT NULL;
