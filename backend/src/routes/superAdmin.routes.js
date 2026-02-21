const router = require('express').Router();
const authMiddleware= require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const c = require('../controllers/superAdmin.controller');

// router.use(authMiddleware);
// router.use(roleMiddleware('SUPERADMIN'));


router.post('/managers',  c.createManager);
router.get('/managers',  c.getManagers);
router.post('/parking-areas',  c.createParkingArea);
router.get('/parking-areas',  c.getParkingAreas);
router.get('/parking-areas/:id',  c.getParkingAreaDetails);
router.post('/approve-driver/:userId', c.approveDriver);
router.get('/pending-drivers', c.getPendingDrivers);

module.exports = router;
