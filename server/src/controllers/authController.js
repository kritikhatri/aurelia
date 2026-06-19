import User from '../models/User.js';
import ReferralLog from '../models/ReferralLog.js';
import { generateAccessToken, generateRefreshToken, sendRefreshTokenCookie } from '../utils/generateToken.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique referral code for the new user
    const generatedReferralCode = 'AURELIA-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Check if referred by someone
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password, // Pre-save hook hashes it
      referralCode: generatedReferralCode,
      referredBy: referrer ? referrer._id : null
    });

    if (user) {
      // If there was a valid referrer, log it
      if (referrer) {
        await ReferralLog.create({
          referrer: referrer._id,
          referee: user._id,
          status: 'pending'
        });
      }

      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      sendRefreshTokenCookie(res, refreshToken);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skinType: user.skinType,
        skinConcerns: user.skinConcerns,
        rewardPoints: user.rewardPoints,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        theme: user.theme,
        accessToken
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      sendRefreshTokenCookie(res, refreshToken);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skinType: user.skinType,
        skinConcerns: user.skinConcerns,
        rewardPoints: user.rewardPoints,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        theme: user.theme,
        accessToken
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Not authorized, no refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'aurelia_refresh_secret_key_67890');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user._id);
    return res.json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Not authorized, refresh token failed' });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash');
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.skinType = req.body.skinType !== undefined ? req.body.skinType : user.skinType;
    user.skinConcerns = req.body.skinConcerns || user.skinConcerns;
    user.theme = req.body.theme || user.theme;

    if (req.body.password) {
      user.passwordHash = req.body.password;
    }

    const updatedUser = await user.save();
    
    // Return standard updated payload with accessToken
    const accessToken = generateAccessToken(updatedUser._id);
    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      skinType: updatedUser.skinType,
      skinConcerns: updatedUser.skinConcerns,
      rewardPoints: updatedUser.rewardPoints,
      referralCode: updatedUser.referralCode,
      theme: updatedUser.theme,
      accessToken
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// Forgot/Reset Password Placeholders
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  // Send email simulation
  return res.json({ message: `Reset link sent to ${email} (simulated)` });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  return res.json({ message: 'Password reset successfully (simulated)' });
};

// Verify Email Placeholder
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  return res.json({ message: 'Email verified successfully (simulated)' });
};
