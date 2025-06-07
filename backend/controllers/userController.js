const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const secret = 'rahasia';

// REGISTER USERS
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashed };

    User.create(newUser, (err) => {
      if (err) return res.status(500).json({ message: 'Error creating user', error: err });
      res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// LOGIN USERS
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1d' });
    res.json({
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email
  }
});

  });
};

exports.getAll = (req, res) => {
  User.findAll((err, users) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
    res.json(users);
  });
};

exports.getOne = (req, res) => {
  User.findById(req.params.id, (err, users) => {
    if (err || users.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  });
};

exports.update = async (req, res) => {
  try {
    const userId = req.params.id;
    let updateData = { ...req.body };

    // Jika ada file foto baru, masukkan nama file ke updateData.photo
    if (req.file) {
      updateData.photo = req.file.filename;

      // Cari user dulu untuk hapus foto lama (opsional)
      const user = await User.findById(userId); // Sesuaikan method ini dengan modelmu
      if (user && user.photo) {
        const oldPhotoPath = path.join(__dirname, '../public/image', user.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    // Jika ada password, hash dulu
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Update user di database
    User.update(userId, updateData, (err) => {
      if (err) return res.status(500).json({ message: 'Error updating user', error: err });
      res.json({ message: 'User updated successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.remove = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Error deleting user', error: err });
    res.json({ message: 'User deleted successfully' });
  });
};

exports.getOneProfile = (req, res) => {
  const userId = req.user.id;
  User.findById(userId, (err, users) => {
    if (err || users.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  });
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  let updateData = { name, email };

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  User.update(userId, updateData, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating profile', error: err });
    res.json({ message: 'Profile updated successfully' });
  });
};

// LOGIN ADMIN
exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email dan password harus diisi' });

  User.findByEmail(email, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Terjadi kesalahan server' });
    }

    if (!results || results.length === 0)
      return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const admin = results[0];

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Bukan akun admin' });
    }

    const match = bcrypt.compareSync(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      secret,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  });
};

