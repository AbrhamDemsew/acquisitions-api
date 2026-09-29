import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';

const deriveKey = promisify(scrypt);

const verifyPassword = async (password, passwordHash) => {
  if (!password || !passwordHash) {
    return false;
  }

  if (passwordHash.startsWith('$2')) {
    return bcrypt.compare(password, passwordHash);
  }

  const [salt, storedKey] = passwordHash.split(':');
  if (!salt || !storedKey || storedKey.length !== 128) {
    return false;
  }

  try {
    const derivedKey = await deriveKey(password, salt, 64);
    return timingSafeEqual(Buffer.from(storedKey, 'hex'), derivedKey);
  } catch {
    return false;
  }
};

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password', { error });
    throw new Error('Error hashing password', { cause: error });
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    logger.info(`User created with email: ${email} successfully!`);
    return user;
  } catch (error) {
    if (error.message === 'Email already exists' || error.code === '23505') {
      throw new Error('Email already exists', { cause: error });
    }

    logger.error('Error creating user', { error });
    throw new Error('Error creating user', { cause: error });
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.password.startsWith('$2')) {
      await db
        .update(users)
        .set({ password: await hashPassword(password), updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    logger.info(`User logged in successfully: ${email}`);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      throw error;
    }

    logger.error('Error logging in user', { error });
    throw new Error('Error logging in user', { cause: error });
  }
};
