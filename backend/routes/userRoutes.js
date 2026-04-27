const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const allowRoles = require('../middleware/roleCheck');
const userCtrl = require('../controllers/userCtrl');
const router = express.Router();

router.use(checkAuth);
router.use(allowRoles('user'));

router.get('/stores', userCtrl.getStoresForUser);
router.post('/rating', userCtrl.submitOrUpdateRating);

module.exports = router;