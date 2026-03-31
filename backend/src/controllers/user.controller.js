const prisma = require('../config/prisma');

const getCars = async (req, res) => {
  try {
    const userId = req.user.id;
    const cars = await prisma.car.findMany({
      where: { userId }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addCar = async (req, res) => {
  try {
    const { plateNumber, brand, model, color } = req.body;
    const userId = req.user.id;

    if (!plateNumber || !/^[A-Za-z0-9 -]+$/.test(plateNumber)) {
      return res.status(400).json({ error: 'Valid Plate Number is required (alphanumeric)' });
    }
    if (!brand || brand.trim().length < 2) {
      return res.status(400).json({ error: 'Valid brand name is required' });
    }
    if (!model || model.trim().length < 2) {
      return res.status(400).json({ error: 'Valid model name is required' });
    }

    const car = await prisma.car.create({
      data: {
        id: `CAR-${Date.now()}`,
        userId,
        plateNumber,
        brand,
        model,
        color
      }
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, brand, model, color } = req.body;
    const userId = req.user.id;

    if (!plateNumber || !/^[A-Za-z0-9 -]+$/.test(plateNumber)) {
      return res.status(400).json({ error: 'Valid Plate Number is required (alphanumeric)' });
    }
    if (!brand || brand.trim().length < 2) {
      return res.status(400).json({ error: 'Valid brand name is required' });
    }
    if (!model || model.trim().length < 2) {
      return res.status(400).json({ error: 'Valid model name is required' });
    }

    // Verify car belongs to user
    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar || existingCar.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized or car not found' });
    }

    const updatedCar = await prisma.car.update({
      where: { id },
      data: { plateNumber, brand, model, color }
    });

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify car belongs to user
    const existingCar = await prisma.car.findUnique({ where: { id } });
    if (!existingCar || existingCar.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized or car not found' });
    }

    await prisma.car.delete({ where: { id } });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getParkingAreas = async (req, res) => {
  try {
    const areas = await prisma.parkingArea.findMany({
      where: { status: 'ACTIVE' }
    });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createTicket = async (req, res) => {
  try {
    const { carId, parkingAreaId } = req.body;
    const userId = req.user.id;

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: `TKT-${Date.now()}`,
        carId,
        userId,
        parkingAreaId,
        status: 'REQUESTED'
      }
    });

    const drivers = await prisma.driver.findMany({
      where: {
        parkingAreaId,
        status: 'AVAILABLE'
      }
    });

    for (const driver of drivers) {
      await prisma.driverRequest.create({
        data: {
          id: `REQ-${Date.now()}-${driver.userId}`,
          requestType: 'PARKING',
          ticketNo: ticket.ticketNumber,
          driverId: driver.userId,
          status: 'PENDING'
        }
      });
    }

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: {
        car: true,
        parkingArea: true,
        requests: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const requestRetrieval = async (req, res) => {
  try {
    const { ticketNumber } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { ticketNumber },
      include: {
        requests: {
          where: {
            requestType: 'RETRIEVAL',
            status: { in: ['PENDING', 'APPROVED'] }
          }
        }
      }
    });

    if (ticket.requests.length > 0) {
      return res.status(400).json({ error: 'Retrieval request already sent' });
    }

    const drivers = await prisma.driver.findMany({
      where: {
        parkingAreaId: ticket.parkingAreaId,
        status: 'AVAILABLE'
      }
    });

    for (const driver of drivers) {
      await prisma.driverRequest.create({
        data: {
          id: `REQ-${Date.now()}-${driver.userId}`,
          requestType: 'RETRIEVAL',
          ticketNo: ticket.ticketNumber,
          driverId: driver.userId,
          status: 'PENDING'
        }
      });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getCars,
  addCar,
  updateCar,
  deleteCar,
  getParkingAreas,
  createTicket,
  getTickets,
  requestRetrieval,
  getProfile
};
