import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const expiresIn = process.env.JWT_EXPIRES_IN || '7h';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  logger.warn(
    'JWT_SECRET is not set in production environment! Using insecure default fallback.'
  );
}

export const jwtToken = {
  sign: payload => {
    try {
      return jwt.sign(payload, secretKey, { expiresIn });
    } catch (e) {
      logger.error('Failed to generate JWT token', { error: e });
      throw new Error('Failed to generate token', { cause: e });
    }
  },
  verify: token => {
    try {
      return jwt.verify(token, secretKey);
    } catch (e) {
      logger.error('Failed to verify JWT token', { error: e });
      throw new Error('Invalid token', { cause: e });
    }
  },
};

// Backward compatibility alias for any existing imports
export const jwttokent = jwtToken;
