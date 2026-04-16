import { Router } from 'express';
import { createMeeting, getMeetings } from '../controllers/meetingController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', getMeetings);
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.TEACHER), createMeeting);

export default router;
