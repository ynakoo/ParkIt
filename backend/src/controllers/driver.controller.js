const prisma = require('../config/prisma');

const getProfile = async (req, res) => {
  try {
    const driverId = req.user.id;
    
    const driver = await prisma.driver.findUnique({
      where: { userId: driverId },
      include: {
        user: true,
        parkingArea: true
      }
    });

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getRequests = async (req, res) => {
  try {
    const driverId = req.user.id;

    const requests = await prisma.driverRequest.findMany({
      where: {
        driverId,
        status: 'PENDING'
      },
      include: {
        ticket: {
          include: {
            car: true,
            user: true,
            parkingArea: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const driverId = req.user.id;

    const request = await prisma.driverRequest.findUnique({
      where: { id: requestId },
      include: { ticket: true }
    });

    if (!request || request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request not available' });
    }

    await prisma.driverRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' }
    });

    await prisma.driver.update({
      where: { userId: driverId },
      data: { status: 'BUSY' }
    });

    await prisma.ticket.update({
      where: { ticketNumber: request.ticketNo },
      data: { status: request.requestType === 'PARKING' ? 'DRIVER_ASSIGNED' : 'CAR_ON_THE_WAY' }
    });

    await prisma.driverRequest.deleteMany({
      where: {
        ticketNo: request.ticketNo,
        id: { not: requestId }
      }
    });

    res.json({ message: 'Request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const completeParking = async (req, res) => {
  try {
    const { ticketNumber } = req.body;
    const driverId = req.user.id;

    await prisma.driverRequest.deleteMany({
      where: {
        ticketNo: ticketNumber,
        driverId
      }
    });

    await prisma.ticket.update({
      where: { ticketNumber },
      data: { status: 'PARKED' }
    });

    await prisma.driver.update({
      where: { userId: driverId },
      data: { status: 'AVAILABLE' }
    });

    res.json({ message: 'Car parked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const completeRetrieval = async (req, res) => {
  try {
    const { ticketNumber } = req.body;
    const driverId = req.user.id;

    await prisma.driverRequest.deleteMany({
      where: {
        ticketNo: ticketNumber,
        driverId
      }
    });

    await prisma.ticket.update({
      where: { ticketNumber },
      data: { status: 'COMPLETED' }
    });

    await prisma.driver.update({
      where: { userId: driverId },
      data: { status: 'AVAILABLE' }
    });

    res.json({ message: 'Car retrieved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getActiveTickets = async (req, res) => {
  try {
    const driverId = req.user.id;

    const activeRequests = await prisma.driverRequest.findMany({
      where: {
        driverId,
        status: 'APPROVED'
      },
      include: {
        ticket: {
          include: {
            car: true,
            user: true,
            parkingArea: true
          }
        }
      }
    });

    res.json(activeRequests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getProfile,
  getRequests,
  acceptRequest,
  completeParking,
  completeRetrieval,
  getActiveTickets
};
