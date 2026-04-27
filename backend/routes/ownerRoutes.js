const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const allowRoles = require('../middleware/roleCheck');
const ownerCtrl = require('../controllers/ownerCtrl');
const router = express.Router();

router.use(checkAuth);
router.use(allowRoles('store_owner'));

router.get('/dashboard', ownerCtrl.getOwnerDashboard);

module.exports = router;