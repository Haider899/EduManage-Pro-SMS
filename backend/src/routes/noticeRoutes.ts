import { Router } from 'express';
import { createNotice, getNotices, deleteNotice } from '../controllers/noticeController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getNotices);

router.post('/', restrictTo('admin'), createNotice);
router.delete('/:id', restrictTo('admin'), deleteNotice);

export default router;
