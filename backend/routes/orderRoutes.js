const express = require('express');
const router = express.Router();
const { protect, userOnly, vendorOnly } = require('../middleware/auth');
const o = require('../controllers/orderController');

router.post('/', protect, userOnly, o.placeOrder);
router.get('/user', protect, userOnly, o.getUserOrders);
router.put('/cancel/:id', protect, userOnly, o.cancelOrder);

// Vendor transaction routes
router.get('/vendor/requests', protect, vendorOnly, o.getVendorRequests);
router.put('/vendor/request/:id', protect, vendorOnly, o.updateRequestStatus);
router.delete('/vendor/request/:id', protect, vendorOnly, o.deleteRequest);

module.exports = router;
