const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/authorizeRole'); // middleware cek role
const upload = require('../middleware/uploadMiddleware');

// Pelanggan & Admin
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/admin/login', userController.loginAdmin);

// Data user, cuma admin yang boleh akses getAll, delete user
router.get('/users', protect, authorizeRole('admin'), userController.getAll);
router.get('/users/:id', protect, authorizeRole('admin'), userController.getAll);
router.delete('/users/:id', protect(['admin']), userController.remove);
router.put('/users/:id', protect(['admin', 'user']), upload.single('photo'), userController.update);

// Profile user yang sedang login (semua user boleh akses dan update profilnya sendiri)
router.get('/profile', protect, userController.getOneProfile);
router.put('/profile', protect, upload.single('photo'), userController.updateProfile);

module.exports = router;
