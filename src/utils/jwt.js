import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const expiresIn = process.env.JWT_EXPIRES_IN || '7h';

// export const generateToken = (payload, expiresIn = '1h') => {
//   return jwt.sign(payload, secretKey, { expiresIn });
// };

// export const verifyToken = (token) => {
//   try {
//     return jwt.verify(token, secretKey);
//   } catch (error) {
//     throw new Error('Invalid token');
//   }
// };

export const jwttokent = {
    sign: (payload) => {
        try{
            return jwt.sign(payload, secretKey, { expiresIn });
        }catch(e){
            logger.error('Failed to generate JWT token', e);
            throw new Error('Failed to generate token');
        }
    },
    verify: (token) => {
        try{
            return jwt.verify(token, secretKey);

        }catch(e){
            logger.error('Failed to verify JWT token', e);
            throw new Error('Invalid token');
        }
    }
}