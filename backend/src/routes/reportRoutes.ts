import { Router } from 'express';
import { getFullReport } from '../controllers/reportController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);
router.use(restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN));

router.get('/full', getFullReport);

export default router;
