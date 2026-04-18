const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productPrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  productImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
