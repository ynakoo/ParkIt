const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const {
  createComplaint,
  getUserComplaints,
  getManagerComplaints,
  getManagerTickets,
} = require('../controllers/complaint.controller');

// User routes
router.post('/', authMiddleware, roleMiddleware('USER'), createComplaint);
router.get('/my', authMiddleware, roleMiddleware('USER'), getUserComplaints);

// Manager routes
router.get('/manager', authMiddleware, roleMiddleware('MANAGER'), getManagerComplaints);
router.get('/manager/tickets', authMiddleware, roleMiddleware('MANAGER'), getManagerTickets);

module.exports = router;
