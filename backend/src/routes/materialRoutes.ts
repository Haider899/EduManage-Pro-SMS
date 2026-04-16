import { Router } from 'express';
import { uploadMaterial, getMaterials } from '../controllers/materialController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', restrictTo(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.HR, UserRole.TEACHER), getMaterials);
router.post('/', restrictTo(UserRole.SUPERADMIN, UserRole.HR, UserRole.TEACHER), uploadMaterial);

export default router;
