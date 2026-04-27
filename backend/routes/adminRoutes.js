const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const allowRoles = require('../middleware/roleCheck');
const adminCtrl = require('../controllers/adminCtrl');
const router = express.Router();

router.use(checkAuth);
router.use(allowRoles('admin'));

router.get('/stats', adminCtrl.getStats);
router.post('/users', adminCtrl.addNewUser);
router.get('/stores', adminCtrl.listStores);
router.get('/users', adminCtrl.listUsers);
router.get('/users/:id', adminCtrl.getUserById);
router.post('/stores', adminCtrl.addStore);

module.exports = router;