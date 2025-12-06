import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as mealsController from '../controllers/meals.controller';

const router = Router();

router.patch('/:id/toggle', authenticate, mealsController.toggleMeal);

export default router;
