import dotenv from 'dotenv';

dotenv.config();

// DATABASE_URL is used for the database connection in this application
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'PORT',
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`✗ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

export const config = {
  port: process.env.PORT || 5000,
  // Database URL for Prisma/Supabase PostgreSQL
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL || undefined,
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};