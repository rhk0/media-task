import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to check if the user is signed in (authenticated)
export const isRequiredSignIn = async (req, res, next) => {
  try {
    
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
 
    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if the user is an Admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);  // Fetch user using decoded user ID from token

    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ error: 'Access denied, admin only' });
    }

    next();  // User is an admin, proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Middleware to check if the user is a regular User
export const isUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);  // Fetch user using decoded user ID from token

    if (!user || user.role !== 'User') {
      return res.status(403).json({ error: 'Access denied, user only' });
    }

    next();  // User is a regular user, proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
