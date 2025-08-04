const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists with this email" });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Split name into first and last name
    const nameParts = name.split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    // Insert new user
    const [result] = await db.pool.execute(
      `INSERT INTO users (email, password, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, first_name, last_name, "user"]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.insertId, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: result.insertId,
        name: name,
        email,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const [users] = await db.pool.execute(
      "SELECT id, email, password, first_name, last_name, role, is_active FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      console.error(`Login failed: User not found for email - ${email}`);
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const user = users[0];

    if (!user.is_active) {
      return res
        .status(401)
        .json({ success: false, error: "Account is deactivated" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error(`Login failed: Invalid password for user - ${email}`);
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Update last login
    await db.pool.execute(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

const verify = async (req, res) => {
  try {
    // The user is already authenticated by the middleware
    const [users] = await db.pool.execute(
      "SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ valid: false, error: "User not found" });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(401).json({ valid: false, error: "Account is deactivated" });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ valid: false, error: "Verification failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const [users] = await db.pool.execute(
      "SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    const fullName = `${user.first_name} ${user.last_name}`.trim() || "User";

    res.json({
      user: {
        ...user,
        name: fullName,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;

    await db.pool.execute(
      "UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?",
      [first_name, last_name, phone, req.user.id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = { register, login, verify, getProfile, updateProfile };