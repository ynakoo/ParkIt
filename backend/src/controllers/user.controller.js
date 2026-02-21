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

module.exports = {
  getCars,
  addCar,
  getParkingAreas,
  createTicket,
  getTickets,
  requestRetrieval
};
