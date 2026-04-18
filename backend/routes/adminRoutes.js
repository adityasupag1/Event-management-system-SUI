const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const a = require('../controllers/adminController');

// Users
router.get('/users', protect, adminOnly, a.getAllUsers);
router.post('/users', protect, adminOnly, a.addUser);
router.put('/users/:id', protect, adminOnly, a.updateUser);
router.delete('/users/:id', protect, adminOnly, a.deleteUser);

// Vendors
router.get('/vendors', protect, adminOnly, a.getAllVendors);
router.post('/vendors', protect, adminOnly, a.addVendor);
router.put('/vendors/:id', protect, adminOnly, a.updateVendor);
router.delete('/vendors/:id', protect, adminOnly, a.deleteVendor);

// Memberships
router.get('/memberships', protect, adminOnly, a.getAllMemberships);
router.post('/memberships', protect, adminOnly, a.addMembership);
router.put('/memberships/:id', protect, adminOnly, a.updateMembership);
router.delete('/memberships/:id', protect, adminOnly, a.deleteMembership);

module.exports = router;
