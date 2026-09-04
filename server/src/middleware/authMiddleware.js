import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Validates JWT token from HTTP-only cookie or Bearer authorization header.
 * Attaches authenticated user object to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Check Authorization header fallback (Bearer <token>)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no authentication token provided'
    });
  }

  try {
    const decoded = verifyToken(token);

    // Fetch user without password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user account no longer exists'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token'
    });
  }
};

/**
 * Role-Based Authorization Middleware
 * Restricts access to specific user roles (e.g. 'MERCHANT', 'ADMIN')
 * @param  {...string} roles Allowed roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' does not have permission to access this resource`
      });
    }

    next();
  };
};

/**
 * Optional Authentication Middleware
 * Attaches user object if valid token exists, but proceeds regardless.
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid or expired - proceed as unauthenticated
    }
  }
  next();
};
