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

const checkOrders = async () => {
  const connection = await mysql.createConnection(config);
  
  try {
    console.log('🔍 Checking orders in database...');
    
    // Check if orders table exists and has data
    const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    console.log(`📦 Found ${orders[0].count} orders in database`);
    
    if (orders[0].count > 0) {
      // Show all orders with user details
      const [allOrders] = await connection.execute(`
        SELECT o.*, u.first_name, u.last_name, u.email 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `);
      
      console.log('\n📋 Current orders:');
      allOrders.forEach(order => {
        console.log(`  - Order #${order.id}: ${order.first_name} ${order.last_name} - $${order.total_amount} - Status: ${order.status} - Date: ${order.created_at}`);
      });
      
      // Check order items
      const [orderItems] = await connection.execute(`
        SELECT oi.*, p.name as product_name 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        ORDER BY oi.order_id
      `);
      
      console.log('\n📦 Order items:');
      orderItems.forEach(item => {
        console.log(`  - Order #${item.order_id}: ${item.product_name} x${item.quantity} - $${item.price} each`);
      });
    } else {
      console.log('❌ No orders found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
};

checkOrders(); 