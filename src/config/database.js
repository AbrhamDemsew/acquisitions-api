import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error('DATABASE_URL must be set to a PostgreSQL connection string')
}
const sql = postgres(databaseUrl)
const db = drizzle(sql);

export {db , sql};

