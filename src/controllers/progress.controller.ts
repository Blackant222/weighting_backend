import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as userRepo from '../repositories/user.repository';
import * as planRepo from '../repositories/plan.repository';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await userRepo.getUserProfile(req.userId!);
    
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.json({
      success: true,
      data: {
        xp: profile.xp,
        points: profile.points,
        level: profile.level,
        streak: profile.streak,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdherence = async (req: AuthRequest, res: Response) => {
  try {
    const plan = await planRepo.getActiveDietPlan(req.userId!);
    
    if (!plan) {
      return res.json({ success: true, data: { adherence: 0 } });
    }

    const totalMeals = plan.days.reduce((sum, day) => sum + day.meals.length, 0);
    const completedMeals = plan.days.reduce(
      (sum, day) => sum + day.meals.filter(m => m.completed).length,
      0
    );

    const adherence = totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0;

    res.json({ success: true, data: { adherence } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
