import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as planRepo from '../repositories/plan.repository';

export const toggleMeal = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const meal = await planRepo.toggleMealCompletion(id);
    
    res.json({
      success: true,
      data: {
        meal,
        rewards: { xpGained: 0, pointsGained: 0 }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
