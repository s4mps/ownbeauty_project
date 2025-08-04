const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

class User {
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        "SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { email, password, first_name, last_name, phone } = userData;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await pool.execute(
        "INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)",
        [email, hashedPassword, first_name, last_name, phone]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updateProfile(id, updateData) {
    const allowedUpdates = ["first_name", "last_name", "phone"];
    const updates = [];
    const values = [];

    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) return null;

    values.push(id);
    try {
      const [result] = await pool.execute(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
