import logger from '../config/logger.js';
import { loginSchema, signupSchema } from '../validations/auth.validations.js';
import { formatValidationErrors } from '../utils/format.js';
import { jwtToken } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';
import { createUser, loginUser } from '../services/auth.service.js';
import { z } from 'zod';

export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.safeParse(req.body);

    if (!validatedData.success) {
      const formattedErrors = formatValidationErrors(validatedData.error);
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: formattedErrors });
    }

    const user = await createUser(validatedData.data);
    const token = jwtToken.sign({ id: user.id, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${user.email}`);
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    logger.error('Error during signup:', { error });
    if (error instanceof z.ZodError) {
      const formattedErrors = formatValidationErrors(error);
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: formattedErrors });
    }
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signin = async (req, res) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      const formattedErrors = formatValidationErrors(validatedData.error);
      return res
        .status(400)
        .json({ message: 'Validation failed', errors: formattedErrors });
    }

    const user = await loginUser(validatedData.data);
    const token = jwtToken.sign({ id: user.id, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`User logged in successfully: ${user.email}`);
    return res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    logger.error('Error during signin:', { error });
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const signout = (req, res) => {
  try {
    cookies.clear(res, 'token');
    logger.info('User logged out successfully');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Error during signout:', { error });
    return res.status(500).json({ message: 'Internal server error' });
  }
};
