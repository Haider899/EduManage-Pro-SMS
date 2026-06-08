import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);

// Admin and HR can create teachers
router.post('/',
  restrictTo('superadmin', 'admin', 'hr'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('qualification').notEmpty().withMessage('Qualification is required'),
  ],
  validate,
  createTeacher
);

// Admin and HR can update teachers
router.put('/:id', restrictTo('superadmin', 'admin', 'hr'), updateTeacher);
router.patch('/:id', restrictTo('superadmin', 'admin', 'hr'), updateTeacher);

// Only Admin can delete teachers
router.delete('/:id', restrictTo('superadmin', 'admin'), deleteTeacher);

export default router;
