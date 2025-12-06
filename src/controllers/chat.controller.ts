import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as chatRepo from '../repositories/chat.repository';
import * as userRepo from '../repositories/user.repository';
import * as planRepo from '../repositories/plan.repository';
import * as geminiService from '../services/gemini.service';

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const history = await chatRepo.getChatHistory(req.userId!);
    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { message, image } = req.body;
    
    const userProfile = await userRepo.getUserProfile(req.userId!);
    const dietPlan = await planRepo.getActiveDietPlan(req.userId!);
    
    if (!userProfile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    await chatRepo.saveChatMessage(req.userId!, 'user', message, image);

    const history = await chatRepo.getChatHistory(req.userId!);
    const geminiHistory = history.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await geminiService.chatWithNutritionist(
      geminiHistory,
      message,
      userProfile,
      dietPlan,
      image
    );

    await chatRepo.saveChatMessage(req.userId!, 'model', response);

    res.json({ success: true, data: { response } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const clearHistory = async (req: AuthRequest, res: Response) => {
  try {
    await chatRepo.clearChatHistory(req.userId!);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
