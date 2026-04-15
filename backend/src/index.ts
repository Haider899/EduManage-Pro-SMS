import express from 'express';
import cors from 'cors';
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

// Validate environment variables
validateEnv();

const app = express();

// Middleware
// Configure CORS to be developer-friendly: reflect origin in development,
// and use configured origins in production.
const corsOptions = (reqOrigin: string | undefined) => {
  if (config.nodeEnv === 'development') {
    return { origin: true, credentials: true };
  }

  const allowed = (config.corsOrigin || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    origin: (origin: string | undefined, cb: any) => {
      // Allow non-browser requests (no origin) and requests from allowed list
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
};

app.use((req, res, next) => {
  const opts = corsOptions(req.headers.origin as string | undefined);
  // @ts-ignore - cors types are compatible
  cors(opts)(req, res, next);
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
import User from './models/User';

const seedAdmin = async () => {
  try {
    const adminUsername = 'LAZY-404';
    const adminPassword = 'SuperAdmin899';
    
    const admin = await User.findOne({ 
      $or: [{ username: adminUsername.toLowerCase() }, { role: 'admin' }] 
    });

    if (!admin) {
      console.log('🌱 No admin found. Seeding initial administrator...');
      await User.create({
        name: 'Haider',
        username: adminUsername,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`✓ Initial Admin Created: Haider (Username: ${adminUsername})`);
    } else {
      // In development, we ensure the password matches the hardcoded one if it's the main admin
      admin.password = adminPassword;
      await admin.save();
      console.log(`✓ Admin account verified and password synced for: ${admin.username}`);
    }
  } catch (error) {
    console.error('✗ Seeding Error:', error);
  }
};

export let IS_MOCK_MODE = false;

const connectDB = async () => {
  try {
    console.log('📡 Attempting MongoDB Connection...');
    await mongoose.connect(config.mongodbUri, { 
      serverSelectionTimeoutMS: 5000 
    });
    console.log('✓ MongoDB Connected Successfully');
    await seedAdmin();
  } catch (error: any) {
    console.warn('✗ MongoDB Connection Failed');

    if (config.nodeEnv === 'development') {
      console.log('🔄 Retrying with Local MongoDB fallback (localhost:27017)...');
      try {
        const localUri = 'mongodb://localhost:27017/school-management-system';
        await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
        console.log('✓ Local MongoDB Connected Successfully');
        await seedAdmin();
      } catch (localError) {
        console.warn('⚠️  DB CONNECTION FAILED: Entering MOCK MODE with local data.');
        console.warn('💡 Tip: No database changes will be persisted.');
        IS_MOCK_MODE = true;
      }
    } else {
      process.exit(1);
    }
  }
};


// Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/fees', feeRoutes);


// Error Handler Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`\n🚀 School Management System Server`);
      console.log(`📍 Running on http://localhost:${config.port}`);
      console.log(`🗂️  Environment: ${config.nodeEnv}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

