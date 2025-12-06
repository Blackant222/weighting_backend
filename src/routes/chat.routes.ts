import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as chatController from '../controllers/chat.controller';

const router = Router();

router.get('/history', authenticate, chatController.getHistory);
router.post('/message', authenticate, chatController.sendMessage);
router.delete('/history', authenticate, chatController.clearHistory);

export default router;
