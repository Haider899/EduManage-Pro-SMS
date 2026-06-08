import { Router } from 'express';
import {
  getAllGrades,
  createGrade,
  updateGrade,
} from '../controllers/gradeController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Grades can be viewed by Admin, HR, Teachers and Students
router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher', 'student'), getAllGrades);

// Only Admin and Teachers can manage grades
router.post('/', restrictTo('superadmin', 'admin', 'teacher'), createGrade);
router.patch('/:id', restrictTo('superadmin', 'admin', 'teacher'), updateGrade);

export default router;
