import { Router } from 'express';
import { getLedger } from '../controllers/feeController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.use(restrictTo('superadmin', 'admin', 'hr'));

router.get('/ledger', getLedger);

export default router;
