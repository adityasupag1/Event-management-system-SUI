const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const RequestItem = require('../models/RequestItem');

// Place order
exports.placeOrder = async (req, res) => {
  try {
    const { name, number, email, paymentMethod, address, state, city, pinCode } = req.body;
    
    // Validate
    if (!name || !number || !email || !paymentMethod || !address || !state || !city || !pinCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const user = await User.findById(req.user.id);
    const totalAmount = cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    
    const order = await Order.create({
      userId: req.user.id,
      userName: user.name,
      userEmail: user.email,
      items: cart.items,
      totalAmount,
      name, number, email, paymentMethod, address, state, city, pinCode,
      status: 'Received'
    });
    
    // Create request items entries for vendors
    for (const item of cart.items) {
      await RequestItem.create({
        userId: req.user.id,
        userName: user.name,
        userEmail: user.email,
        userAddress: `${address}, ${city}, ${state} - ${pinCode}`,
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        productId: item.productId,
        productName: item.productName,
        status: 'Received'
      });
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's orders (Order Status)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: get user requests (transactions)
exports.getVendorRequests = async (req, res) => {
  try {
    const requests = await RequestItem.find({ vendorId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await RequestItem.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    request.status = status;
    await request.save();
    
    // Also update the Order status
    const order = await Order.findOne({ 
      userId: request.userId,
      'items.productId': request.productId
    });
    if (order) {
      order.status = status;
      await order.save();
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await RequestItem.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
