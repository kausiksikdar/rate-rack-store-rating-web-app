const express = require('express');
const { register, login, changePassword, logout } = require('../controllers/authCtrl');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/password', checkAuth, changePassword);
router.post('/logout', checkAuth, logout);

module.exports = router;