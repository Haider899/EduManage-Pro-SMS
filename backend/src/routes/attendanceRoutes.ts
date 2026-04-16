import { Router } from 'express';
import {
  getAttendance,
  markAttendance,
  markAttendanceBulk,
  getStudentAttendance,
} from '../controllers/attendanceController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

// Attendance can be viewed by Admin, HR, and Teachers
router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER, UserRole.STUDENT), getAttendance);

// Only Admin and Teachers can mark attendance
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER), markAttendance);
router.post('/bulk', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER), markAttendanceBulk);

router.get('/student/:studentId', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER, UserRole.STUDENT), getStudentAttendance);

export default router;
