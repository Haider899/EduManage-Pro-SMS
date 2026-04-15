import { Router } from 'express';
import {
  getAllGrades,
  createGrade,
  updateGrade,
} from '../controllers/gradeController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Grades can be viewed by Admin, HR, and Teachers
router.get('/', restrictTo('admin', 'hr', 'teacher'), getAllGrades);

// Only Admin and Teachers can manage grades
router.post('/', restrictTo('admin', 'teacher'), createGrade);
router.patch('/:id', restrictTo('admin', 'teacher'), updateGrade);

export default router;
