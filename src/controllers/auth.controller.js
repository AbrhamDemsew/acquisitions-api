import logger from '../config/logger.js';
import { signupSchema } from '../validations/auth.validations.js';
import { formatValidationErrors } from '../utils/format.js';
import { jwttokent } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';
import { createUser } from '#services/auth.service';
import {z} from 'zod';

export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

       
        // Validate the request body using the signupSchema
        const validatedData = signupSchema.safeParse({ name, email, password, role });

        if (!validatedData.success) {
            const formattedErrors = formatValidationErrors(validatedData.error);
            return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
        }

        // Call the service layer to handle user signup
        // const user = await authService.signup(validatedData.data);
         const user =  await createUser({ name, email, password, role });
        // Generate a JWT token for the newly created user
        const token = jwttokent.sign({ id: user.id, role: user.role });

        // Set the token in an HTTP-only cookie
        cookies.set(res, 'token', token);

        logger.info(`User registered successfully: ${user.email}`);
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        logger.error('Error during signup:', error);
        if (error instanceof z.ZodError) {
            const formattedErrors = formatValidationErrors(error);
            return res.status(400).json({ message: 'Validation failed', errors: formattedErrors });
        }
        if (error.message === 'Email already exists') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}