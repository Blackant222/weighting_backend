import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as planRepo from '../repositories/plan.repository';

export const getActivePlan = async (req: AuthRequest, res: Response) => {
  try {
    const plan = await planRepo.getActiveDietPlan(req.userId!);
    res.json({ success: true, data: plan });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const savePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { plan } = req.body;
    await planRepo.saveDietPlan(req.userId!, plan);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
