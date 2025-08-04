const db = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [userCount] = await db.execute(
      'SELECT COUNT(*) as total FROM users WHERE role = "user"'
    );

    // Get total products
    const [productCount] = await db.execute(
      'SELECT COUNT(*) as total FROM products'
    );

    // Get total orders
    const [orderCount] = await db.execute(
      'SELECT COUNT(*) as total FROM orders'
    );

    // Get total revenue
    const [revenue] = await db.execute(
      'SELECT SUM(total_amount) as total FROM orders WHERE status = "delivered"'
    );

    res.json({
      stats: {
        totalUsers: userCount[0].total,
        totalProducts: productCount[0].total,
        totalOrders: orderCount[0].total,
        totalRevenue: revenue[0].total || 0
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT id, email, first_name, last_name, role, is_active, created_at, last_login
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const [result] = await db.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name, description, brand, price, sale_price, stock_quantity,
      category_id, featured, images, tags
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO products (name, description, brand, price, sale_price, stock_quantity, 
                           category_id, featured, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)
    `, [name, description, brand, price, sale_price, stock_quantity, category_id, featured]);

    const productId = result.insertId;

    // Add product images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await db.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
          [productId, images[i], i === 0]
        );
      }
    }

    res.status(201).json({
      message: 'Product added successfully',
      product: { id: productId, name }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, brand, price, sale_price, stock_quantity,
      category_id, featured, is_active
    } = req.body;

    const [result] = await db.execute(`
      UPDATE products 
      SET name = ?, description = ?, brand = ?, price = ?, sale_price = ?, 
          stock_quantity = ?, category_id = ?, featured = ?, is_active = ?
      WHERE id = ?
    `, [name, description, brand, price, sale_price, stock_quantity,
      category_id, featured, is_active, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - set is_active to false
    const [result] = await db.execute(
      'UPDATE products SET is_active = false WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, u.email, u.first_name, u.last_name,
             COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus
};
