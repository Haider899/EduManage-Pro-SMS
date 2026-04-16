import { Router } from 'express';
import {
  getAllGrades,
  createGrade,
  updateGrade,
} from '../controllers/gradeController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

// Grades can be viewed by Admin, HR, and Teachers
router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER, UserRole.STUDENT), getAllGrades);

// Only Admin and Teachers can manage grades
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER), createGrade);
router.patch('/:id', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER), updateGrade);

export default router;
