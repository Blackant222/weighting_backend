import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as usersController from '../controllers/users.controller';

const router = Router();

router.get('/profile', authenticate, usersController.getProfile);
router.put('/profile', authenticate, usersController.updateProfile);
router.post('/onboarding', authenticate, usersController.completeOnboarding);
router.delete('/profile', authenticate, usersController.deleteProfile);

export default router;
