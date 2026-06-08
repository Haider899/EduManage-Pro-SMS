import { Router } from 'express';
import { createNotice, getNotices, deleteNotice } from '../controllers/noticeController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getNotices);

router.post('/', restrictTo('superadmin', 'admin', 'hr'), createNotice);
router.delete('/:id', restrictTo('superadmin', 'admin'), deleteNotice);

export default router;
