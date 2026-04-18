const express = require('express');
const router = express.Router();
const { protect, userOnly } = require('../middleware/auth');
const c = require('../controllers/cartController');

router.get('/', protect, userOnly, c.getCart);
router.post('/add', protect, userOnly, c.addToCart);
router.put('/update', protect, userOnly, c.updateQuantity);
router.delete('/item/:productId', protect, userOnly, c.removeItem);
router.delete('/clear', protect, userOnly, c.clearCart);

module.exports = router;
