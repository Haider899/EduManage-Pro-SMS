import { Router } from 'express';
import { createAssignment, getAssignments, deleteAssignment } from '../controllers/assignmentController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER), getAssignments);
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.HR, UserRole.TEACHER), createAssignment);
router.delete('/:id', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), deleteAssignment);

export default router;
