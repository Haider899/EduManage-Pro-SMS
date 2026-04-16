import { Router } from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('admin', 'hr', 'teacher', 'superadmin'), getLeaves);
router.post('/', restrictTo('teacher', 'hr', 'superadmin', 'admin'), applyLeave);
router.put('/:id/status', restrictTo('admin', 'hr', 'superadmin'), updateLeaveStatus);

export default router;
