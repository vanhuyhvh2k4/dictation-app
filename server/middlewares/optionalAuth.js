// middlewares/optionalAuth.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    next();
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    next();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      next();
      return;
    }
    req.userId = payload.id;
    next();
  });
};

export default optionalAuth;