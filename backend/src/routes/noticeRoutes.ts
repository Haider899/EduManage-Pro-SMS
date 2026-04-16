import { Router } from 'express';
import { createNotice, getNotices, deleteNotice } from '../controllers/noticeController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', getNotices);

router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR), createNotice);
router.delete('/:id', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN), deleteNotice);

export default router;
