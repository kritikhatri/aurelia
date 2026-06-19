import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_ACCESS_SECRET || 'aurelia_access_secret_key_12345', 
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_REFRESH_SECRET || 'aurelia_refresh_secret_key_67890', 
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' }
  );
};

export const sendRefreshTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production (HTTPS only)
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  res.cookie('refreshToken', token, cookieOptions);
};
