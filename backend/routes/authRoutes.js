const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/user/signup', auth.userSignup);
router.post('/user/login', auth.userLogin);

router.post('/vendor/signup', auth.vendorSignup);
router.post('/vendor/login', auth.vendorLogin);

router.post('/admin/login', auth.adminLogin);

module.exports = router;
