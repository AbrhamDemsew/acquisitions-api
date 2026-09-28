import {z} from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, 'Username must be at least 3 characters long').trim(),
  email: z.email().max(255, 'Email must be at most 255 characters long').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(125),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});