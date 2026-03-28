const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { getCars, addCar, updateCar, deleteCar, getParkingAreas, createTicket, getTickets, requestRetrieval } = require('../controllers/user.controller');

router.use(authMiddleware);
router.use(roleMiddleware('USER'));

router.get('/cars', getCars);
router.post('/cars', addCar);
router.put('/cars/:id', updateCar);
router.delete('/cars/:id', deleteCar);
router.get('/parking-areas', getParkingAreas);
router.post('/tickets', createTicket);
router.get('/tickets', getTickets);
router.post('/request-retrieval', requestRetrieval);

module.exports = router;
