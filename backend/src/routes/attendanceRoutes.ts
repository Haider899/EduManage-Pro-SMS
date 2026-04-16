import { Router } from 'express';
import {
  getAttendance,
  markAttendance,
  getStudentAttendance,
} from '../controllers/attendanceController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Attendance can be viewed by Admin, HR, and Teachers
router.get('/', restrictTo('admin', 'hr', 'teacher'), getAttendance);

// Only Admin and Teachers can mark attendance
router.post('/', restrictTo('admin', 'teacher'), markAttendance);
router.post('/bulk', restrictTo('admin', 'teacher'), markAttendanceBulk);

router.get('/student/:studentId', restrictTo('admin', 'hr', 'teacher'), getStudentAttendance);

export default router;
