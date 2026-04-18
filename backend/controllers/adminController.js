const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Membership = require('../models/Membership');

// USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, status, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (status) user.status = status;
    if (password) user.password = password;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, status: user.status });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// VENDORS
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}).select('-password');
    res.json(vendors);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addVendor = async (req, res) => {
  try {
    const { name, email, password, category } = req.body;
    if (!name || !email || !password || !category) return res.status(400).json({ message: 'All fields are required' });
    const existing = await Vendor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Vendor already exists' });
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    const vendor = await Vendor.create({
      name, email, password, category,
      membership: { duration: '6 months', startDate: new Date(), endDate }
    });
    res.status(201).json({ _id: vendor._id, name: vendor.name, email: vendor.email, category: vendor.category });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    const { name, email, category, status, password } = req.body;
    if (name) vendor.name = name;
    if (email) vendor.email = email;
    if (category) vendor.category = category;
    if (status) vendor.status = status;
    if (password) vendor.password = password;
    await vendor.save();
    res.json({ _id: vendor._id, name: vendor.name, email: vendor.email, category: vendor.category, status: vendor.status });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    await vendor.deleteOne();
    res.json({ message: 'Vendor deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// MEMBERSHIPS
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({}).populate('vendorId', 'name email category');
    res.json(memberships);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.addMembership = async (req, res) => {
  try {
    const { vendorId, duration } = req.body;
    if (!vendorId || !duration) return res.status(400).json({ message: 'All fields are required' });
    if (!['6 months', '1 year', '2 years'].includes(duration)) {
      return res.status(400).json({ message: 'Invalid duration' });
    }
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (duration === '6 months') endDate.setMonth(endDate.getMonth() + 6);
    else if (duration === '1 year') endDate.setFullYear(endDate.getFullYear() + 1);
    else if (duration === '2 years') endDate.setFullYear(endDate.getFullYear() + 2);
    
    const membership = await Membership.create({
      vendorId, vendorName: vendor.name, duration, startDate, endDate
    });
    
    vendor.membership = { duration, startDate, endDate };
    await vendor.save();
    
    res.status(201).json(membership);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    const { duration, status } = req.body;
    if (duration) {
      if (!['6 months', '1 year', '2 years'].includes(duration)) {
        return res.status(400).json({ message: 'Invalid duration' });
      }
      membership.duration = duration;
      const endDate = new Date(membership.startDate);
      if (duration === '6 months') endDate.setMonth(endDate.getMonth() + 6);
      else if (duration === '1 year') endDate.setFullYear(endDate.getFullYear() + 1);
      else if (duration === '2 years') endDate.setFullYear(endDate.getFullYear() + 2);
      membership.endDate = endDate;
      
      const vendor = await Vendor.findById(membership.vendorId);
      if (vendor) {
        vendor.membership = { duration, startDate: membership.startDate, endDate };
        await vendor.save();
      }
    }
    if (status) membership.status = status;
    await membership.save();
    res.json(membership);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    await membership.deleteOne();
    res.json({ message: 'Membership deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
