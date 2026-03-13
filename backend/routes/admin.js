const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getUsers);

module.exports = router;
