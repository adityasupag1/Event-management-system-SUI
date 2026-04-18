const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

// Vendor: add product
exports.addProduct = async (req, res) => {
  try {
    const { productName, productPrice, productImage } = req.body;
    if (!productName || !productPrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    
    const product = await Product.create({
      vendorId: vendor._id,
      vendorName: vendor.name,
      productName,
      productPrice,
      productImage: productImage || '',
      category: vendor.category
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: get own products
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor: update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { productName, productPrice, productImage } = req.body;
    if (productName) product.productName = productName;
    if (productPrice) product.productPrice = productPrice;
    if (productImage !== undefined) product.productImage = productImage;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: get all vendors by category
exports.getVendorsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const vendors = await Vendor.find({ category, status: 'Active' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User: get products of a specific vendor
exports.getProductsByVendor = async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.params.vendorId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  res.json(['Catering', 'Florist', 'Decoration', 'Lighting']);
};
