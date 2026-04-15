import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, forgotPassword, resetPassword, updateMe, updatePassword, onboardStaff } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('identifier').notEmpty().withMessage('Identifier (email/username) is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protected routes
router.use(protect);
router.patch('/updateMe', updateMe);
router.patch('/updatePassword', updatePassword);
router.post('/onboard-staff', onboardStaff);

export default router;
