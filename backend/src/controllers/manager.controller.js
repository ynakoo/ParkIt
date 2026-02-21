const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const getDrivers = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const parkingArea = await prisma.parkingArea.findUnique({
      where: { managerId },
      include: {
        drivers: {
          include: {
            user: true
          }
        }
      }
    });

    if (!parkingArea) {
      return res.status(404).json({ error: 'No parking area assigned' });
    }

    res.json(parkingArea.drivers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addDriver = async (req, res) => {
  try {
    const { name, email, password, dlNumber } = req.body;
    const managerId = req.user.id;

    const parkingArea = await prisma.parkingArea.findUnique({
      where: { managerId }
    });

    if (!parkingArea) {
      return res.status(404).json({ error: 'No parking area assigned' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'DRIVER'
      }
    });

    await prisma.driver.create({
      data: {
        userId: user.id,
        parkingAreaId: parkingArea.id,
        dlNumber,
        status: 'INACTIVE'
      }
    });

    res.status(201).json({ message: 'Driver added, pending approval' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: {
        parkingArea: true
      }
    });

    res.json(manager);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getDrivers, addDriver, getProfile };







