const mysql = require('mysql2/promise');

const makeUserAdmin = async (email) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sampana2006_',
        database: 'ownbeauty_db'
    });

    try {
        // Update user role to admin
        const [result] = await connection.execute(
            'UPDATE users SET role = "admin" WHERE email = ?',
            [email]
        );

        if (result.affectedRows > 0) {
            console.log(`✅ Successfully made ${email} an admin!`);
        } else {
            console.log(`❌ User with email ${email} not found.`);
        }
    } catch (error) {
        console.error('Error updating user role:', error);
    } finally {
        await connection.end();
    }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log('Usage: node makeAdmin.js <email>');
    console.log('Example: node makeAdmin.js user@example.com');
    process.exit(1);
}

makeUserAdmin(email); 