import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as progressController from '../controllers/progress.controller';

const router = Router();

router.get('/stats', authenticate, progressController.getStats);
router.get('/adherence', authenticate, progressController.getAdherence);

export default router;
