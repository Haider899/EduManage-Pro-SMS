import { Router } from 'express';
import {
  getTimetable,
  createSlot,
  updateSlot,
  deleteSlot,
  bulkUpdate,
} from '../controllers/timetableController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

// Viewing timetable: allowed to many roles
router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER, UserRole.STUDENT), getTimetable);

// Create/update/delete - restricted to admin/hr/superadmin
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), createSlot);
router.put('/:id', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), updateSlot);
router.delete('/:id', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), deleteSlot);

// Bulk replace
router.post('/bulk', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), bulkUpdate);

export default router;
