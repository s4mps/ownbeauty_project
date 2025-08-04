const db = require('../config/database');

const getWishlist = async (req, res) => {
  try {
    const [wishlistItems] = await db.execute(`
      SELECT w.*, p.name, p.price, p.sale_price, p.stock_quantity, 
             pi.image_url as primary_image,
             CASE WHEN p.sale_price IS NOT NULL THEN 'true' ELSE 'false' END as on_sale
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
      WHERE w.user_id = ? AND p.is_active = true
      ORDER BY w.created_at DESC
    `, [req.user.id]);

    res.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if product exists
    const [products] = await db.execute(
      'SELECT id FROM products WHERE id = ? AND is_active = true',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already in wishlist
    const [existing] = await db.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    await db.execute(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.user.id, product_id]
    );

    res.json({ message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found in wishlist' });
    }

    res.json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

const checkWishlistStatus = async (req, res) => {
  try {
    const { product_id } = req.params;

    const [items] = await db.execute(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    res.json({ isInWishlist: items.length > 0 });
  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({ error: 'Failed to check wishlist status' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
};
