import logger from '../config/logger.js';
import bycrypt from 'bcrypt';
import { db } from '../config/database.js';
import { users } from '../models/user.model.js';
import { eq } from 'drizzle-orm';


export const hashPassword = async (password) => {
    try{
        return await bycrypt.hash(password, 10);
    } catch (error) {
        logger.error('Error hashing password');
        throw new Error('Error hashing password');
    }
}

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        const hashedPassword = await hashPassword(password);
        const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

        if (existingUser.length > 0) {
            throw new Error('Email already exists');
        }

        const [user] = await db
            .insert(users)
            .values({ name, email, password: hashedPassword, role })
            .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

        logger.info(`User created with email: ${email} Successfully!`);
        return user;
    } catch (error) {
        logger.error('Error creating user');
        throw new Error('Error creating user');
    }
}









// import { randomBytes, scrypt } from 'node:crypto';
// import { promisify } from 'node:util';



// const deriveKey = promisify(scrypt);

// const hashPassword = async (password) => {
//     const salt = randomBytes(16).toString('hex');
//     const derivedKey = await deriveKey(password, salt, 64);
//     return `${salt}:${derivedKey.toString('hex')}`;
// };

// const signup = async ({ name, email, password, role = 'user' }) => {
//     const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

//     if (existingUser.length > 0) {
//         throw new Error('Email already exists');
//     }

//     const [user] = await db
//         .insert(users)
//         .values({ name, email, password: await hashPassword(password), role })
//         .returning({ id: users.id, name: users.name, email: users.email, role: users.role });

//     return user;
// };

// export default { signup };
