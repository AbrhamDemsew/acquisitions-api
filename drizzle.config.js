import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL must be set to a PostgreSQL connection string')
}

export default {
    schema: './src/models/*.js',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: databaseUrl,
    },
}