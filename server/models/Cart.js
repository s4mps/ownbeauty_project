const { pool } = require("../config/database");

class Cart {
  static async getCart(userId) {
    try {
      const [rows] = await pool.execute(
        `
        SELECT c.id, c.quantity, p.* 
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async addItem(userId, productId, quantity = 1) {
    try {
      // Check if item already exists in cart
      const [existing] = await pool.execute(
        "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );

      if (existing.length > 0) {
        // Update quantity if item exists
        await pool.execute(
          "UPDATE cart SET quantity = quantity + ? WHERE id = ?",
          [quantity, existing[0].id]
        );
      } else {
        // Add new item if it doesn't exist
        await pool.execute(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [userId, productId, quantity]
        );
      }

      return this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async updateQuantity(userId, productId, quantity) {
    try {
      if (quantity <= 0) {
        await this.removeItem(userId, productId);
      } else {
        await pool.execute(
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [quantity, userId, productId]
        );
      }
      return this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async removeItem(userId, productId) {
    try {
      await pool.execute(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );
      return this.getCart(userId);
    } catch (error) {
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      await pool.execute("DELETE FROM cart WHERE user_id = ?", [userId]);
      return [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart;