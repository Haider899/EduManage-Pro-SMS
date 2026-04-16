import { Router } from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER), getLeaves);
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER), applyLeave);
router.put('/:id/status', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), updateLeaveStatus);

export default router;
