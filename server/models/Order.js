const db = require('../config/database');

class Order {
  static async create(orderData) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const { user_id, total_amount, subtotal, tax_amount, shipping_amount, shipping_address, payment_method, notes } = orderData;
      
      const [result] = await connection.execute(`
        INSERT INTO orders (user_id, total_amount, subtotal, tax_amount, shipping_amount, 
                           shipping_address, payment_method, notes, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [user_id, total_amount, subtotal, tax_amount, shipping_amount, shipping_address, payment_method, notes]);
      
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id, userId = null) {
    let query = 'SELECT * FROM orders WHERE id = ?';
    let params = [id];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    const [orders] = await db.execute(query, params);
    return orders[0] || null;
  }

  static async findByUserId(userId) {
    const [orders] = await db.execute(`
      SELECT o.*, 
             COUNT(oi.id) as item_count,
             GROUP_CONCAT(p.name SEPARATOR ', ') as product_names
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);
    
    return orders;
  }

  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async getOrderItems(orderId) {
    const [items] = await db.execute(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    return items;
  }
}

module.exports = Order;
