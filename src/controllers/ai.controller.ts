import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as geminiService from '../services/gemini.service';
import * as planRepo from '../repositories/plan.repository';

export const suggestGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { profile, imageBase64 } = req.body;
    const result = await geminiService.suggestGoalWeight(profile, imageBase64 || null);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { profile, imageBase64 } = req.body;
    const plan = await geminiService.generateInitialPlan(profile, imageBase64 || null);
    
    if (!plan || !plan.days || plan.days.length === 0) {
      throw new Error('AI failed to generate valid plan');
    }
    
    await planRepo.saveDietPlan(req.userId!, plan);
    
    res.json({ success: true, data: plan });
  } catch (error: any) {
    console.error('Plan generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const nextPhase = async (req: AuthRequest, res: Response) => {
  try {
    const { profile, newWeight, mood, feedback, imageBase64, currentWeek } = req.body;
    const plan = await geminiService.generateNextPhasePlan(
      profile,
      newWeight,
      mood,
      feedback,
      imageBase64 || null,
      currentWeek
    );
    
    await planRepo.saveDietPlan(req.userId!, plan);
    
    res.json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
