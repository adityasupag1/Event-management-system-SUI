const express = require('express');
const router = express.Router();
const { protect, vendorOnly, userOnly } = require('../middleware/auth');
const p = require('../controllers/productController');

router.get('/categories', p.getCategories);
router.post('/', protect, vendorOnly, p.addProduct);
router.get('/vendor', protect, vendorOnly, p.getVendorProducts);
router.delete('/:id', protect, vendorOnly, p.deleteProduct);
router.put('/:id', protect, vendorOnly, p.updateProduct);
router.get('/category/:category', protect, p.getVendorsByCategory);
router.get('/vendor/:vendorId', protect, p.getProductsByVendor);

module.exports = router;
