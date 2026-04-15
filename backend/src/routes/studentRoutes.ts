import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  createBulkStudents,
} from '../controllers/studentController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

const router = Router();

router.use(protect);

router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Admin and HR can create students
router.post('/', 
  restrictTo('admin', 'hr'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('rollNumber').notEmpty().withMessage('Roll number is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
    body('class').notEmpty().withMessage('Class is required'),
    body('section').notEmpty().withMessage('Section is required'),
    body('parentName').notEmpty().withMessage('Parent name is required'),
    body('parentPhone').notEmpty().withMessage('Parent phone is required'),
  ],
  validate,
  createStudent
);
router.post('/bulk', restrictTo('admin', 'hr'), createBulkStudents);

// Admin and HR can update students
router.put('/:id', restrictTo('admin', 'hr'), updateStudent);
router.patch('/:id', restrictTo('admin', 'hr'), updateStudent);

// Only Admin can delete students
router.delete('/:id', restrictTo('admin'), deleteStudent);

export default router;
