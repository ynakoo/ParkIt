-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'MANAGER', 'DRIVER', 'USER');

-- CreateEnum
CREATE TYPE "ManagerStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('AVAILABLE', 'BUSY', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('REQUESTED', 'DRIVER_ASSIGNED', 'PARKING_STARTED', 'PARKED', 'CAR_ON_THE_WAY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('PARKING', 'RETRIEVAL');

-- CreateEnum
CREATE TYPE "ParkingAreaStatus" AS ENUM ('PENDING', 'ACTIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "status" "ParkingAreaStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ParkingArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "userId" TEXT NOT NULL,
    "parkingAreaId" TEXT NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "dlNumber" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticketNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "parkingAreaId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'REQUESTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticketNumber")
);

-- CreateTable
CREATE TABLE "DriverRequest" (
    "id" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL,
    "ticketNo" TEXT NOT NULL,
    "driverId" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingArea_qrCode_key" ON "ParkingArea"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingArea_managerId_key" ON "ParkingArea"("managerId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_dlNumber_key" ON "Driver"("dlNumber");

-- CreateIndex
CREATE INDEX "Driver_parkingArea_idx" ON "Driver"("parkingAreaId");

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "Car"("userId");

-- CreateIndex
CREATE INDEX "Ticket_car_idx" ON "Ticket"("carId");

-- CreateIndex
CREATE INDEX "Ticket_parkingArea_idx" ON "Ticket"("parkingAreaId");

-- CreateIndex
CREATE INDEX "Ticket_user_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX "DriverRequest_driver_idx" ON "DriverRequest"("driverId");

-- CreateIndex
CREATE INDEX "DriverRequest_ticket_idx" ON "DriverRequest"("ticketNo");

-- AddForeignKey
ALTER TABLE "ParkingArea" ADD CONSTRAINT "ParkingArea_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_parkingAreaId_fkey" FOREIGN KEY ("parkingAreaId") REFERENCES "ParkingArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_parkingAreaId_fkey" FOREIGN KEY ("parkingAreaId") REFERENCES "ParkingArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequest" ADD CONSTRAINT "DriverRequest_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRequest" ADD CONSTRAINT "DriverRequest_ticketNo_fkey" FOREIGN KEY ("ticketNo") REFERENCES "Ticket"("ticketNumber") ON DELETE CASCADE ON UPDATE CASCADE;
