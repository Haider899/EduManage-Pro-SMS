import { Router } from 'express';
import { getLedger } from '../controllers/feeController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);
router.use(restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR));

router.get('/ledger', getLedger);

export default router;
