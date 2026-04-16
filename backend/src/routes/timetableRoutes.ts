import { Router } from 'express';
import {
  getTimetable,
  createSlot,
  updateSlot,
  deleteSlot,
  bulkUpdate,
} from '../controllers/timetableController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// Viewing timetable: allowed to many roles
router.get('/', restrictTo('admin', 'hr', 'teacher', 'student', 'superadmin'), getTimetable);

// Create/update/delete - restricted to admin/hr/superadmin
router.post('/', restrictTo('admin', 'hr', 'superadmin'), createSlot);
router.put('/:id', restrictTo('admin', 'hr', 'superadmin'), updateSlot);
router.delete('/:id', restrictTo('admin', 'hr', 'superadmin'), deleteSlot);

// Bulk replace
router.post('/bulk', restrictTo('admin', 'hr', 'superadmin'), bulkUpdate);

export default router;
