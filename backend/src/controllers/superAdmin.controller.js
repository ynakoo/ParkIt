const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const createParkingArea = async (req, res) => {
  const { name, location, qrCode, amount } = req.body;

  const parking = await prisma.parkingArea.create({
    data: {
      name,
      location,
      qrCode,
      amount,
    }
  });
  res.status(201).json(parking);
};

const getParkingAreas = async (req, res) => {
  const areas = await prisma.parkingArea.findMany({
    include:{
      manager:true
    }
  });
  res.json(areas);
};

const getParkingAreaDetails = async (req, res) => {
  const { id } = req.params;
  
  const area = await prisma.parkingArea.findUnique({
    where: { id },
    include: {
      manager: true,
      drivers: {
        include: {
          user: true
        }
      },
      tickets: true
    }
  });
  
  res.json(area);
};

const createManager = async (req, res) => {
  const { name, email, password, parkingAreaId } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const m = prisma.user.findUnique({where:{email}})
  if (m){
    return res.status(400).json({error:"Manager with this email already exists."})
  }
  const manager = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "MANAGER",
    }
  });

  await prisma.parkingArea.update({
    where: { id: parkingAreaId },
    data: {
      managerId: manager.id,
      status:"ACTIVE"
    }
  });

  res.status(201).json({ message: "Manager Created" });
};

const getManagers = async (req, res) => {
  const managers = await prisma.user.findMany({
    where: { role: "MANAGER" }
  });

  res.json(managers);
};

const getPendingDrivers = async (req, res) => {
  const drivers = await prisma.driver.findMany({
    where: {
      status: "INACTIVE"
    },
    include: {
      user: true,
      parkingArea: true
    }
  });

  res.json(drivers);
};

const approveDriver = async (req, res) => {
  const id = req.params.userId;
  console.log("PARAM ID:", req.params.userId);
  await prisma.driver.update({
    where: { userId: id },
    data: { status: "AVAILABLE" }
  });

  res.json({ message: "Driver Approved" });
};

module.exports = {
  createParkingArea,
  getParkingAreas,
  getParkingAreaDetails,
  createManager,
  getManagers,
  getPendingDrivers,
  approveDriver
};
