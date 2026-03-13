const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/my', auth, getUserOrders);
router.get('/all', adminAuth, getAllOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', adminAuth, updateOrderStatus);

module.exports = router;
