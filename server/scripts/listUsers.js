const mysql = require('mysql2/promise');

const listUsers = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sampana2006_',
    database: 'ownbeauty_db'
  });

  try {
    // Get all users
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name, role, created_at FROM users ORDER BY created_at DESC'
    );

    console.log('📋 All Users in Database:');
    console.log('========================');
    
    if (users.length === 0) {
      console.log('❌ No users found in database.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name || 'N/A'} ${user.last_name || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log('   ---');
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await connection.end();
  }
};

listUsers(); 