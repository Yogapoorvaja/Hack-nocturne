const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error();
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = authenticate;