import { Router } from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher'), getLeaves);
router.post('/', restrictTo('superadmin', 'admin', 'hr', 'teacher'), applyLeave);
router.put('/:id/status', restrictTo('superadmin', 'admin', 'hr'), updateLeaveStatus);

export default router;
