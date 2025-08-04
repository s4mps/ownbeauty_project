const { pool } = require("../config/database");

class Product {
  static async findById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findAll({
    page = 1,
    limit = 12,
    category = null,
    sort = "newest",
    search = "",
  }) {
    try {
      let query = "SELECT * FROM products WHERE 1=1";
      const values = [];

      // Add category filter
      if (category && category !== "all") {
        query += " AND category = ?";
        values.push(category);
      }

      // Add search filter
      if (search) {
        query += " AND (name LIKE ? OR description LIKE ?)";
        values.push(`%${search}%`, `%${search}%`);
      }

      // Add sorting
      switch (sort) {
        case "price-low":
          query += " ORDER BY price ASC";
          break;
        case "price-high":
          query += " ORDER BY price DESC";
          break;
        case "rating":
          query += " ORDER BY rating DESC";
          break;
        case "popular":
          query += " ORDER BY rating_count DESC";
          break;
        default: // newest
          query += " ORDER BY created_at DESC";
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += " LIMIT ? OFFSET ?";
      values.push(limit, offset);

      // Get products
      const [products] = await pool.execute(query, values);

      // Get total count for pagination
      let countQuery = "SELECT COUNT(*) as total FROM products WHERE 1=1";
      if (category && category !== "all") {
        countQuery += " AND category = ?";
      }
      if (search) {
        countQuery += " AND (name LIKE ? OR description LIKE ?)";
      }

      const [countRows] = await pool.execute(countQuery, values.slice(0, -2));
      const total = countRows[0].total;

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async create(productData) {
    const { name, description, price, category, stock, image_url, sale_price } =
      productData;
    try {
      const [result] = await pool.execute(
        "INSERT INTO products (name, description, price, category, stock, image_url, sale_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, description, price, category, stock, image_url, sale_price]
      );
      return this.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updateData) {
    const allowedUpdates = [
      "name",
      "description",
      "price",
      "category",
      "stock",
      "image_url",
      "sale_price",
    ];
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
        `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0 ? this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateRating(id) {
    try {
      const [reviews] = await pool.execute(
        "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?",
        [id]
      );

      if (reviews[0].count > 0) {
        await pool.execute(
          "UPDATE products SET rating = ?, rating_count = ? WHERE id = ?",
          [reviews[0].avg_rating, reviews[0].count, id]
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
