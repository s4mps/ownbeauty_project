const mysql = require('mysql2/promise');

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'sampana2006_',
  database: process.env.DB_NAME || 'ownbeauty_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const createTestOrder = async () => {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('🔍 Creating test order...');
    
    // Get first user (admin user)
    const [users] = await connection.execute('SELECT id, email FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }
    
    const userId = users[0].id;
    console.log(`👤 Using user: ${users[0].email} (ID: ${userId})`);
    
    // Get first product
    const [products] = await connection.execute('SELECT id, name, price FROM products LIMIT 1');
    if (products.length === 0) {
      console.log('❌ No products found. Please add products first.');
      return;
    }
    
    const productId = products[0].id;
    const productPrice = products[0].price;
    console.log(`🛍️ Using product: ${products[0].name} (ID: ${productId}, Price: $${productPrice})`);
    
    // Create test order
    const quantity = 2;
    const subtotal = productPrice * quantity;
    const tax = subtotal * 0.1;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;
    
    console.log(`💰 Order details: ${quantity}x $${productPrice} = $${subtotal} + $${tax} tax + $${shipping} shipping = $${total}`);
    
    // Insert order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (user_id, total_amount, subtotal, tax_amount, shipping_amount, 
                         shipping_address, payment_method, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, total, subtotal, tax, shipping, '123 Test Street, Test City, TC 12345', 'credit_card', 'Test order for admin dashboard', 'pending']);
    
    const orderId = orderResult.insertId;
    console.log(`✅ Created order #${orderId}`);
    
    // Insert order item
    await connection.execute(`
      INSERT INTO order_items (order_id, product_id, quantity, price, price_at_time) 
      VALUES (?, ?, ?, ?, ?)
    `, [orderId, productId, quantity, productPrice, productPrice]);
    
    console.log(`✅ Added order item: ${quantity}x ${products[0].name}`);
    
    // Update product stock
    await connection.execute(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, productId]
    );
    
    console.log(`✅ Updated product stock`);
    
    // Verify order was created
    const [verifyOrder] = await connection.execute(`
      SELECT o.*, u.first_name, u.last_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [orderId]);
    
    if (verifyOrder.length > 0) {
      const order = verifyOrder[0];
      console.log(`\n🎉 Test order created successfully!`);
      console.log(`   Order #${order.id}: ${order.first_name} ${order.last_name}`);
      console.log(`   Total: $${order.total_amount}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Date: ${order.created_at}`);
    }
    
  } catch (error) {
    console.error('❌ Error creating test order:', error.message);
  } finally {
    await connection.end();
  }
};

createTestOrder(); 