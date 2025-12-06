import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import aiRoutes from './ai.routes';
import plansRoutes from './plans.routes';
import mealsRoutes from './meals.routes';
import progressRoutes from './progress.routes';
import chatRoutes from './chat.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/ai', aiRoutes);
router.use('/plans', plansRoutes);
router.use('/meals', mealsRoutes);
router.use('/progress', progressRoutes);
router.use('/chat', chatRoutes);

export default router;
