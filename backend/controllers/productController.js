const pool = require('../config/db');

const getProducts = async (req, res) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) { params.push(category); query += ` AND category = $${params.length}`; }
  if (search) { params.push(`%${search}%`); query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`; }
  if (minPrice) { params.push(minPrice); query += ` AND price >= $${params.length}`; }
  if (maxPrice) { params.push(maxPrice); query += ` AND price <= $${params.length}`; }

  const sortMap = { price_asc: 'price ASC', price_desc: 'price DESC', rating: 'rating DESC', newest: 'created_at DESC' };
  query += ` ORDER BY ${sortMap[sort] || 'created_at DESC'}`;

  const offset = (page - 1) * limit;
  params.push(limit, offset);
  query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

  try {
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    res.json({ products: result.rows, total: parseInt(countResult.rows[0].count), page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, category, stock, image_url, is_featured } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, stock, image_url, is_featured) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [name, description, price, category, stock, image_url, is_featured || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, image_url, is_featured } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, category=$4, stock=$5, image_url=$6, is_featured=$7 WHERE id=$8 RETURNING *',
      [name, description, price, category, stock, image_url, is_featured, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeatured = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_featured = true LIMIT 8');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    res.json(result.rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeatured, getCategories };
