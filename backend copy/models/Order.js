const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    price: Number,
    quantity: Number,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    vendorName: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'UPI'],
    required: true 
  },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pinCode: { type: String, required: true },
  status: {
    type: String,
    enum: ['Received', 'Ready for Shipping', 'Out For Delivery', 'Delivered', 'Cancelled'],
    default: 'Received'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
