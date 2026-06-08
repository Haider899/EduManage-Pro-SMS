import { Router } from 'express';
import { uploadMaterial, getMaterials } from '../controllers/materialController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('superadmin', 'admin', 'hr', 'teacher'), getMaterials);
router.post('/', restrictTo('superadmin', 'hr', 'teacher'), uploadMaterial);

export default router;
