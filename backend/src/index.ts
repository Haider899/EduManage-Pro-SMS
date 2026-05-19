import express from 'express';
import cors, { CorsOptions } from 'cors';
import mongoose from 'mongoose';
import { config, validateEnv } from './utils/config';
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
import User, { IUser, UserRole } from './models/User';
import aiRoutes from './routes/aiRoutes';

validateEnv();

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

const seedAdmin = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'lazy-404';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SuperAdmin899';

    const admin = await User.findOne({
      $or: [{ username: adminUsername }, { role: UserRole.SUPERADMIN }, { role: UserRole.ADMIN }],
    }).select('+password') as IUser | null;

    if (!admin) {
      console.log('No admin found. Seeding initial super administrator...');
      await User.create({
        name: 'Haider',
        username: adminUsername,
        password: adminPassword,
        role: UserRole.SUPERADMIN,
      });
      console.log(`Initial super administrator created for: ${adminUsername}`);
      return;
    }

    admin.password = adminPassword;
    if (admin.username === adminUsername) {
      admin.role = UserRole.SUPERADMIN;
    }
    await admin.save();
    console.log(`Admin account verified and password synced for: ${admin.username}`);
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

export let IS_MOCK_MODE = false;

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    await seedAdmin();
  } catch (error: unknown) {
    console.warn('MongoDB connection failed');

    if (config.nodeEnv === 'development') {
      console.log('Retrying with local MongoDB fallback (localhost:27017)...');
      try {
        const localUri = 'mongodb://localhost:27017/school-management-system';
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
        console.log('Local MongoDB connected successfully');
        await seedAdmin();
      } catch (_localError) {
        console.warn('DB connection failed. Entering mock mode with local data.');
        console.warn('No database changes will be persisted.');
        IS_MOCK_MODE = true;
      }
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
      console.log(`\nSchool Management System Server`);
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
