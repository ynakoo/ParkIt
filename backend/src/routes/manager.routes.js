const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const { getDrivers, addDriver, getProfile } = require('../controllers/manager.controller');

router.use(authMiddleware);
router.use(roleMiddleware('MANAGER'));

router.get('/drivers', getDrivers);
router.post('/drivers', addDriver);
router.get('/profile', getProfile);

module.exports = router;
