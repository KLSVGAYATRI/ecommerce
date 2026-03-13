const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [users, products, orders, revenue] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['user']),
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query("SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE status != 'cancelled'"),
    ]);

    const recentOrders = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name
       FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5`
    );

    const salesByMonth = await pool.query(
      `SELECT TO_CHAR(created_at, 'Mon') as month, SUM(total_amount) as sales
       FROM orders WHERE created_at >= NOW() - INTERVAL '6 months' AND status != 'cancelled'
       GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
       ORDER BY EXTRACT(MONTH FROM created_at)`
    );

    const topProducts = await pool.query(
      `SELECT p.name, SUM(oi.quantity) as sold, SUM(oi.price * oi.quantity) as revenue
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       GROUP BY p.name ORDER BY sold DESC LIMIT 5`
    );

    res.json({
      stats: {
        users: parseInt(users.rows[0].count),
        products: parseInt(products.rows[0].count),
        orders: parseInt(orders.rows[0].count),
        revenue: parseFloat(revenue.rows[0].total),
      },
      recentOrders: recentOrders.rows,
      salesByMonth: salesByMonth.rows,
      topProducts: topProducts.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getUsers };
