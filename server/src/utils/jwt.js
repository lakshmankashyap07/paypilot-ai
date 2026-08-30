import jwt from 'jsonwebtoken';

/**
 * Generates a signed JWT for a given user ID.
 * @param {string} userId - Database ID of the user
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'paypilot_dev_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn
  });
};

/**
 * Verifies a JWT token signature and returns payload.
 * @param {string} token - Signed JWT string
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'paypilot_dev_secret_key_2026';
  return jwt.verify(token, secret);
};
