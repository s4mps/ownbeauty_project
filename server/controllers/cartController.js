const db = require("../config/database");

const getCart = async (req, res) => {
  try {
    const [cartItems] = await db.pool.execute(
      `
      SELECT c.id, c.user_id, c.product_id, c.quantity, c.created_at,
             p.name, p.price, p.stock as stock_quantity, p.image_url,
             p.price as current_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `,
      [req.user.id]
    );

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.current_price * item.quantity,
      0
    );
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      cart: {
        items: cartItems,
        subtotal: subtotal,
        totalItems,
        itemCount: cartItems.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists
    const [products] = await db.pool.execute(
      "SELECT id, name, stock FROM products WHERE id = ?",
      [product_id]
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    const product = products[0];

    // Check stock availability
    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, error: "Not enough stock available" });
    }

    // Check if item already exists in cart
    const [existingItems] = await db.pool.execute(
      "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );

    if (existingItems.length > 0) {
      // Update existing cart item
      const newQuantity = existingItems[0].quantity + quantity;

      if (product.stock < newQuantity) {
        return res
          .status(400)
          .json({ success: false, error: "Not enough stock available" });
      }

      await db.pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [
        newQuantity,
        existingItems[0].id,
      ]);
    } else {
      // Add new cart item
      await db.pool.execute(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, product_id, quantity]
      );
    }

    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to add item to cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res
        .status(400)
        .json({ success: false, error: "Quantity must be at least 1" });
    }

    // Check if cart item belongs to user
    const [cartItems] = await db.pool.execute(
      "SELECT c.*, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.id = ? AND c.user_id = ?",
      [id, req.user.id]
    );

    if (cartItems.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Cart item not found" });
    }

    // Check stock availability
    if (cartItems[0].stock < quantity) {
      return res
        .status(400)
        .json({ success: false, error: "Not enough stock available" });
    }

    await db.pool.execute("UPDATE cart SET quantity = ? WHERE id = ?", [
      quantity,
      id,
    ]);

    res.json({ success: true, message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Update cart error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update cart item" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.pool.execute(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Cart item not found" });
    }

    res.json({ success: true, message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to remove item from cart" });
  }
};

const clearCart = async (req, res) => {
  try {
    await db.pool.execute("DELETE FROM cart WHERE user_id = ?", [req.user.id]);
    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ success: false, error: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
