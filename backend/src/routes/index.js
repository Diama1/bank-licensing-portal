import { Router } from 'express';
import authRoutes from "./auth.js";
import applicationRoutes from "./applications.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);

export default router;
