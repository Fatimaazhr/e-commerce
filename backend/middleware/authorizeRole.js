function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access forbidden: role not authorized' });
    }
    next();
  };
}

module.exports = { authorizeRole };
