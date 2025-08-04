const db = require('../config/database');

const createOrder = async (req, res) => {
  console.log('🛒 Starting order creation...');
  console.log('👤 User ID:', req.user?.id);
  console.log('📦 Request body:', req.body);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { shipping_address, payment_method, notes } = req.body;

    // Get cart items
    const [cartItems] = await connection.execute(`
      SELECT c.*, p.name, p.price, p.sale_price, p.stock,
             CASE WHEN p.sale_price IS NOT NULL THEN p.sale_price ELSE p.price END as current_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    console.log('🛍️ Cart items found:', cartItems.length);

    if (cartItems.length === 0) {
      console.log('❌ Cart is empty');
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        console.log(`❌ Not enough stock for ${item.name}`);
        await connection.rollback();
        return res.status(400).json({
          error: `Not enough stock for ${item.name}. Available: ${item.stock}`
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.current_price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    console.log('💰 Order totals:', { subtotal, tax, shipping, total });

    // Create order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (user_id, total_amount, subtotal, tax_amount, shipping_amount, 
                         shipping_address, payment_method, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [req.user.id, total, subtotal, tax, shipping, shipping_address, payment_method, notes]);

    const orderId = orderResult.insertId;
    console.log('✅ Order created with ID:', orderId);

    // Create order items and update stock
    for (const item of cartItems) {
      await connection.execute(`
        INSERT INTO order_items (order_id, product_id, quantity, price, price_at_time) 
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.current_price, item.current_price]);

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    console.log('✅ Order items created and stock updated');

    // Clear cart
    await connection.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    console.log('✅ Cart cleared');

    await connection.commit();
    console.log('✅ Transaction committed successfully');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        total: total.toFixed(2),
        status: 'pending'
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
};

const getOrders = async (req, res) => {
  try {
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
    `, [req.user.id]);

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [orderItems] = await db.execute(`
      SELECT oi.*, p.name, p.brand, pi.image_url as primary_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE oi.order_id = ?
    `, [id]);

    res.json({
      order: {
        ...orders[0],
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

module.exports = { createOrder, getOrders, getOrderById };
