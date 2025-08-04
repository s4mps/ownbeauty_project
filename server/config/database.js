const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "sampana2006_",
  database: process.env.DB_NAME || "ownbeauty_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  decimalNumbers: true,
  // timeout: 60000
});

const promisePool = pool.promise();

async function testConnection() {
  try {
    const [rows] = await promisePool.execute("SELECT 1 + 1 AS result");
    console.log("Database connection successful!");
    console.log("Test result:", rows[0].result);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
}

// Add getConnection method for transaction support
const getConnection = async () => {
  return await promisePool.getConnection();
};

module.exports = {
  pool: promisePool,
  testConnection,
  getConnection,
  execute: promisePool.execute.bind(promisePool)
};