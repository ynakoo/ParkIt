const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { getProfile, getStats, getRequests, acceptRequest, completeParking, completeRetrieval, getActiveTickets } = require('../controllers/driver.controller');

router.use(authMiddleware);
router.use(roleMiddleware('DRIVER'));

router.get('/profile', getProfile);
router.get('/stats', getStats);
router.get('/requests', getRequests);
router.post('/accept-request', acceptRequest);
router.post('/complete-parking', completeParking);
router.post('/complete-retrieval', completeRetrieval);
router.get('/active-tickets', getActiveTickets);

module.exports = router;
