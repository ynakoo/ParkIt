const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const c = require('../controllers/superAdmin.controller');

router.post('/managers', auth, role('SUPERADMIN'), c.createManager);
router.get('/managers', auth, role('SUPERADMIN'), c.getManagers);
router.post('/parking-areas', auth, role('SUPERADMIN'), c.createParkingArea);
router.get('/parking-areas', auth, role('SUPERADMIN'), c.getParkingAreas);
router.post('/approve-driver/:userId', auth, role('SUPERADMIN'), c.approveDriver);
router.get('/pending-drivers', auth, role('SUPERADMIN'), c.getPendingDrivers);

module.exports = router;
