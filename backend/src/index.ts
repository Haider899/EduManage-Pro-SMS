import express from 'express';
import cors, { CorsOptions } from 'cors';
import prisma from './db.js';
import bcrypt from 'bcryptjs'; // Password hashing ke liye (Mongoose model se yahan shift kiya)
import { config } from './utils/config';
import { errorHandler } from './middleware/errorMiddleware';
import studentRoutes from './routes/studentRoutes';
import teacherRoutes from './routes/teacherRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import gradeRoutes from './routes/gradeRoutes';
import authRoutes from './routes/authRoutes';
import noticeRoutes from './routes/noticeRoutes';
import meetingRoutes from './routes/meetingRoutes';
import reportRoutes from './routes/reportRoutes';
import feeRoutes from './routes/feeRoutes';
import timetableRoutes from './routes/timetableRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import materialRoutes from './routes/materialRoutes';
import leaveRoutes from './routes/leaveRoutes';
import aiRoutes from './routes/aiRoutes';

// MONGODB_URI ka check bypass karne ke liye temporary validateEnv ko comment kiya 
// (Agar aapne utils/config se bhi checks hata diye hain toh active rakh sakte hain)
// validateEnv();

const app = express();

const corsOptions = (): CorsOptions => {
  if (config.nodeEnv === 'development') {
    return { origin: true, credentials: true };
  }

  const allowed = (config.corsOrigin || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin: (origin, cb) => {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
};

app.use((req, res, next) => {
  const opts = corsOptions();
  cors(opts)(req, res, next);
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import crypto from 'crypto';

// ===================================================
// Naya Admin Seeding Logic Prisma/Supabase Ke Liye
// ===================================================
const seedAdmin = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'lazy-404';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SuperAdmin899';

    // Prisma query se superadmin check kiya
    const admin = await prisma.profiles.findFirst({
      where: {
        OR: [
          { username: adminUsername },
          { role: 'superadmin' },
          { role: 'admin' }
        ]
      }
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    if (!admin) {
      console.log('No admin found in Supabase. Seeding initial super administrator...');
      const adminId = crypto.randomUUID();
      await prisma.users.create({
        data: {
          id: adminId,
          email: 'admin@school.com',
          encrypted_password: hashedPassword,
          aud: 'authenticated',
          role: 'authenticated',
          email_confirmed_at: new Date(),
          raw_user_meta_data: {
            full_name: 'Haider',
            username: adminUsername,
            role: 'superadmin'
          }
        }
      });
      console.log(`Initial super administrator created for: ${adminUsername}`);
      return;
    }

    // Password refresh sync logic
    await prisma.users.update({
      where: { id: admin.id },
      data: {
        encrypted_password: hashedPassword,
      }
    });
    console.log(`Admin account verified and password synced for: ${admin.username}`);
  } catch (error) {
    console.error('Seeding error on Supabase:', error);
  }
};

export let IS_MOCK_MODE = false;

// Prisma Database Health Connection Test
const connectDB = async () => {
  try {
    console.log('Attempting Supabase PostgreSQL connection via Prisma...');
    await prisma.$connect();
    console.log('Supabase connected successfully via Prisma Client');
    await seedAdmin();
  } catch (error: unknown) {
    console.warn('Supabase Cloud connection failed');
    console.error(error);
    
    if (config.nodeEnv === 'development') {
      console.warn('DB connection failed. Entering local mock mode development.');
      IS_MOCK_MODE = true;
    } else {
      process.exit(1);
    }
  }
};

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    isMockMode: IS_MOCK_MODE,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`\nEducational Management System Server`);
      console.log(`Running on http://localhost:${config.port}`);
      console.log(`Environment: ${config.nodeEnv}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;