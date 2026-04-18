const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Signup
exports.userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email: userId });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor Signup
exports.vendorSignup = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    if (!name || !email || !password || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Vendor already exists' });
    
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    const vendor = await Vendor.create({ 
      name, email, password, category,
      membership: {
        duration: '6 months',
        startDate: new Date(),
        endDate
      }
    });
    res.status(201).json({
      _id: vendor._id,
      name: vendor.name,
      email: vendor.email,
      category: vendor.category,
      role: vendor.role,
      token: generateToken(vendor._id, vendor.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor Login
exports.vendorLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const vendor = await Vendor.findOne({ email: userId });
    if (vendor && await vendor.matchPassword(password)) {
      res.json({
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        category: vendor.category,
        role: vendor.role,
        token: generateToken(vendor._id, vendor.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const admin = await Admin.findOne({ userId });
    if (admin && await admin.matchPassword(password)) {
      res.json({
        _id: admin._id,
        userId: admin.userId,
        role: admin.role,
        token: generateToken(admin._id, admin.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize default admin
exports.initAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ userId: 'Admin' });
    if (!adminExists) {
      await Admin.create({ userId: 'Admin', password: 'Admin' });
      console.log('Default admin created: Admin/Admin');
    }
  } catch (error) {
    console.log('Admin init error:', error.message);
  }
};
