const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  userAddress: String,
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: String,
  status: {
    type: String,
    enum: ['Pending', 'Received', 'Ready for Shipping', 'Out For Delivery', 'Delivered'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('RequestItem', requestItemSchema);
