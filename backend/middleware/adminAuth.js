const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token.split(' ')[1] || token, JWT_SECRET);
    req.user = decoded;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
