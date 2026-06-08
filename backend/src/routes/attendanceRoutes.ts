import { Router } from 'express';
import {
  getAttendance,
  markAttendance,
  markAttendanceBulk,
  getStudentAttendance,
} from '../controllers/attendanceController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Attendance can be viewed by Admin, HR, and Teachers
router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher', 'student'), getAttendance);

// Only Admin and Teachers can mark attendance
router.post('/', restrictTo('superadmin', 'admin', 'teacher'), markAttendance);
router.post('/bulk', restrictTo('superadmin', 'admin', 'teacher'), markAttendanceBulk);

router.get('/student/:studentId', restrictTo('superadmin', 'admin', 'hr', 'teacher', 'student'), getStudentAttendance);

export default router;
