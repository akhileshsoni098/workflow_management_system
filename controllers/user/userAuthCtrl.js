const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const redis = require("../../config/redis");

// ==================== User Registration =================

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || name.trim() == "" || typeof name !== "string") {
      return res.status(400).json({
        status: false,
        message: "Kindly provide valid name it's required",
      });
    }

    if (!email || email.trim() == "" || typeof email !== "string") {
      return res.status(400).json({
        status: false,
        message: "Kindly provide valid email it's required",
      });
    }

    let validEmail = email.toLocaleLowerCase();

    const existing = await User.findOne({ email: validEmail });

    if (existing)
      return res
        .status(400)
        .json({ status: false, message: "Email already used" });

    if (!password || password.trim() == "" || typeof password !== "string") {
      return res.status(400).json({
        status: false,
        message: "Kindly provide valid password it's required",
      });
    }

    if (role) {
      const validRole = ["Admin", "Manager", "Employee"];

      if (!validRole.includes(role)) {
        return res.status(400).json({
          status: false,
          message: `Provide a valid role ${validRole.join("| ")}`,
        });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: validEmail,
      password: hashed,
      role,
    });

    const keys = await redis.keys("users:*");

    if (keys.length) {
      await redis.del(keys);
    }

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================== LogIn User ===========================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });

    const validpassword = await bcrypt.compare(password, user.password);

    if (!validpassword)
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    return res.json({
      status: true,
      token: token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

//========================== Get All Users ==========================

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, name } = req.query;

    const cacheKey = `users:name:${name || "all"}:page:${page}:limit:${limit}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("cache hit");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select({ password: 0 });

    const totalUsers = await User.countDocuments(query);

    const response = {
      status: true,
      data: users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

    console.log("cache miss");

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
