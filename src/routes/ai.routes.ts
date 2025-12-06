import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.post('/suggest-goal', authenticate, aiController.suggestGoal);
router.post('/generate-plan', authenticate, aiController.generatePlan);
router.post('/next-phase', authenticate, aiController.nextPhase);

export default router;
