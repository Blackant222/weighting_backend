import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as plansController from '../controllers/plans.controller';

const router = Router();

router.get('/active', authenticate, plansController.getActivePlan);
router.post('/save', authenticate, plansController.savePlan);

export default router;
