import { Router } from 'express';
import { uploadMaterial, getMaterials } from '../controllers/materialController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('admin', 'hr', 'teacher', 'superadmin'), getMaterials);
router.post('/', restrictTo('teacher', 'hr', 'superadmin'), uploadMaterial);

export default router;
