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
router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher', 'student'), getTimetable);

// Create/update/delete - restricted to admin/hr/superadmin
router.post('/', restrictTo('superadmin', 'admin', 'hr'), createSlot);
router.put('/:id', restrictTo('superadmin', 'admin', 'hr'), updateSlot);
router.delete('/:id', restrictTo('superadmin', 'admin', 'hr'), deleteSlot);

// Bulk replace
router.post('/bulk', restrictTo('superadmin', 'admin', 'hr'), bulkUpdate);

export default router;
