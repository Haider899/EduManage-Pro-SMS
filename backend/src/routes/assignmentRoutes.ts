import { Router } from 'express';
import { createAssignment, getAssignments, deleteAssignment } from '../controllers/assignmentController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher'), getAssignments);
router.post('/', restrictTo('superadmin', 'hr', 'teacher'), createAssignment);
router.delete('/:id', restrictTo('superadmin', 'admin', 'hr'), deleteAssignment);

export default router;
