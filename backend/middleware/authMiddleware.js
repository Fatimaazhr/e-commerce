const jwt = require('jsonwebtoken');
const secret = 'rahasia';

function protect(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;

      // Kalau allowedRoles kosong, berarti semua role boleh akses
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Akses tidak diizinkan' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
  };
}

module.exports = protect;
