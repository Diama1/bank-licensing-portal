import { Router } from 'express';
import authRoutes from "./auth.js";

const router = Router();

router.use(authRoutes);

export default router;
