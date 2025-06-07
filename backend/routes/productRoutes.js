const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.getAllProduk);
router.get('/:id', productController.getProdukById);

// Gunakan middleware upload untuk create dan update
router.post('/', upload.single('gambar'), productController.createProduk);
router.put('/:id', upload.single('gambar'), productController.updateProduk);
router.delete('/:id', productController.deleteProduk);

module.exports = router;
