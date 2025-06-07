const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/image')); // folder tujuan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // nama file unik
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
    const validMime = allowed.test(file.mimetype);
    if (validExt && validMime) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar (jpg/jpeg/png/gif)'));
    }
  }
});

module.exports = upload; // ✅ penting!
