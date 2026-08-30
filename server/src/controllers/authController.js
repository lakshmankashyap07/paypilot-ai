import User from '../models/User.js';
import Merchant from '../models/Merchant.js';
import { generateToken } from '../utils/jwt.js';

// Helper to set HTTP-only authentication cookie
const sendTokenResponse = (user, statusCode, message, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          avatar: user.avatar || '',
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
};

/**
 * Register User (CUSTOMER only)
 * POST /api/auth/register
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Force server assignment of role = CUSTOMER for security
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: phone ? phone.trim() : '',
      role: 'CUSTOMER'
    });

    sendTokenResponse(user, 201, 'User registered successfully', res);
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user with password field included
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If user is a MERCHANT, enforce merchant approval status
    if (user.role === 'MERCHANT') {
      let merchant = await Merchant.findOne({ user: user._id });
      if (!merchant) {
        merchant = await Merchant.create({
          user: user._id,
          storeName: `${user.name}'s Store`,
          category: 'General',
          address: 'Demo Merchant HQ',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          status: 'APPROVED'
        });
      }

      if (merchant.status === 'PENDING') {
        return res.status(403).json({
          success: false,
          message: 'Your merchant account is pending approval.',
          status: 'PENDING'
        });
      }

      if (merchant.status === 'REJECTED') {
        return res.status(403).json({
          success: false,
          message: 'Your merchant account application was rejected.',
          status: 'REJECTED'
        });
      }

      if (merchant.status === 'SUSPENDED') {
        return res.status(403).json({
          success: false,
          message: 'Your merchant account has been suspended.',
          status: 'SUSPENDED'
        });
      }
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    sendTokenResponse(user, 200, 'Login successful', res);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout User
 * POST /api/auth/logout
 */
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: null
  });
};

/**
 * Get Current User Profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current user profile fetched successfully',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        role: req.user.role,
        avatar: req.user.avatar || '',
        isActive: req.user.isActive,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    }
  });
};

/**
 * Update Profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          avatar: user.avatar || '',
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password
 * PUT /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Fetch user with password field
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Assign new password (triggers pre-save bcrypt hashing hook)
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, 'Password changed successfully', res);
  } catch (error) {
    next(error);
  }
};
