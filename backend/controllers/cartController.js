const pool = require('../config/db');

const getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, p.stock
       FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    await pool.query(
      `INSERT INTO carts (user_id, product_id, quantity) VALUES ($1,$2,$3)
       ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = carts.quantity + $3`,
      [req.user.id, product_id, quantity]
    );
    res.json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      await pool.query('DELETE FROM carts WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.productId]);
    } else {
      await pool.query('UPDATE carts SET quantity=$1 WHERE user_id=$2 AND product_id=$3', [req.body.quantity, req.user.id, req.params.productId]);
    }
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM carts WHERE user_id=$1 AND product_id=$2', [req.user.id, req.params.productId]);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM carts WHERE user_id=$1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
