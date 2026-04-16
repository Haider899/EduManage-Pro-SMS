import { Router } from 'express';
import { createAssignment, getAssignments, deleteAssignment } from '../controllers/assignmentController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('admin', 'hr', 'teacher', 'superadmin'), getAssignments);
router.post('/', restrictTo('teacher', 'hr', 'superadmin'), createAssignment);
router.delete('/:id', restrictTo('admin', 'hr', 'superadmin'), deleteAssignment);

export default router;
