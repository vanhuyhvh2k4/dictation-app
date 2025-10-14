// middlewares/isAdminMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    
    // Kiểm tra role admin
    if (payload.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access forbidden: Admin privileges required'
      });
    }

    req.userId = payload.id; 
    
    next();
  });
};

export default isAdminMiddleware;
