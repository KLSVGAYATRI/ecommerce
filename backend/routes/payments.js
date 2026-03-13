// payments.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

router.post('/verify', auth, async (req, res) => {
  const { order_id, transaction_id } = req.body;
  try {
    await pool.query(
      'UPDATE payments SET payment_status = $1, transaction_id = $2 WHERE order_id = $3',
      ['completed', transaction_id, order_id]
    );
    await pool.query("UPDATE orders SET status = 'processing' WHERE id = $1", [order_id]);
    res.json({ message: 'Payment verified' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
