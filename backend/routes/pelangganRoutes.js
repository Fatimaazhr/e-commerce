const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/checkout', checkoutController); // <- sudah benar

module.exports = router;
