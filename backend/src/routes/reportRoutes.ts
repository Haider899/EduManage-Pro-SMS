import { Router } from 'express';
import { getFullReport } from '../controllers/reportController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.use(restrictTo('superadmin', 'admin'));

router.get('/full', getFullReport);

export default router;
