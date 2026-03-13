const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

router.put('/profile', auth, async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name=$1, phone=$2, address=$3 WHERE id=$4 RETURNING id, name, email, phone, address, role',
      [name, phone, address, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Wishlist
router.get('/wishlist', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT w.id, p.* FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = $1',
    [req.user.id]
  );
  res.json(result.rows);
});

router.post('/wishlist', auth, async (req, res) => {
  await pool.query(
    'INSERT INTO wishlist (user_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [req.user.id, req.body.product_id]
  );
  res.json({ message: 'Added to wishlist' });
});

router.delete('/wishlist/:productId', auth, async (req, res) => {
  await pool.query('DELETE FROM wishlist WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.productId]);
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
