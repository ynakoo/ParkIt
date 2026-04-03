const prisma = require('../config/prisma');

// POST /api/complaints — Create a complaint (USER)
const createComplaint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ticketNumber, subject, description } = req.body;

    // Ticket selection is mandatory
    if (!ticketNumber) {
      return res.status(400).json({ error: 'Please select a ticket for your complaint' });
    }
    if (!subject || subject.trim().length < 2) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!description || description.trim().length < 5) {
      return res.status(400).json({ error: 'Description is required (minimum 5 characters)' });
    }

    // Verify the ticket belongs to this user
    const ticket = await prisma.ticket.findUnique({
      where: { ticketNumber },
    });

    if (!ticket || ticket.userId !== userId) {
      return res.status(403).json({ error: 'Ticket not found or does not belong to you' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        id: `CMP-${Date.now()}`,
        userId,
        ticketNumber,
        parkingAreaId: ticket.parkingAreaId,
        description: `[${subject.trim()}] ${description.trim()}`,
        status: 'OPEN',
      },
      include: {
        ticket: { include: { parkingArea: true, car: true } },
      },
    });

    res.status(201).json(complaint);
  } catch (error) {
    console.error('createComplaint error:', error);
    res.status(500).json({ error: 'Server error while creating complaint' });
  }
};

// GET /api/complaints/my — Get logged-in user's complaints (USER)
const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const complaints = await prisma.complaint.findMany({
      where: { userId },
      include: {
        ticket: { include: { parkingArea: true, car: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(complaints);
  } catch (error) {
    console.error('getUserComplaints error:', error);
    res.status(500).json({ error: 'Server error while fetching complaints' });
  }
};

// GET /api/complaints/manager — Get complaints for manager's parking area (MANAGER)
const getManagerComplaints = async (req, res) => {
  try {
    const managerId = req.user.id;

    const parkingArea = await prisma.parkingArea.findFirst({
      where: { managerId },
    });

    if (!parkingArea) {
      return res.status(404).json({ error: 'No parking area assigned to this manager' });
    }

    const complaints = await prisma.complaint.findMany({
      where: { parkingAreaId: parkingArea.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticket: { include: { car: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(complaints);
  } catch (error) {
    console.error('getManagerComplaints error:', error);
    res.status(500).json({ error: 'Server error while fetching complaints' });
  }
};

// GET /api/complaints/manager/tickets — Get all tickets for manager's parking area (MANAGER)
const getManagerTickets = async (req, res) => {
  try {
    const managerId = req.user.id;

    const parkingArea = await prisma.parkingArea.findFirst({
      where: { managerId },
    });

    if (!parkingArea) {
      return res.status(404).json({ error: 'No parking area assigned to this manager' });
    }

    const tickets = await prisma.ticket.findMany({
      where: { parkingAreaId: parkingArea.id },
      include: {
        car: true,
        user: { select: { id: true, name: true, email: true } },
        requests: {
          include: {
            driver: { include: { user: { select: { name: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    console.error('getManagerTickets error:', error);
    res.status(500).json({ error: 'Server error while fetching tickets' });
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getManagerComplaints,
  getManagerTickets,
};
