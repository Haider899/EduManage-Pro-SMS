import { Router } from 'express';
import { createMeeting, getMeetings } from '../controllers/meetingController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getMeetings);
router.post('/', restrictTo('admin', 'teacher'), createMeeting);

export default router;
