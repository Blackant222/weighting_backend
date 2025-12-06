import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as userRepo from '../repositories/user.repository';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await userRepo.getUserProfile(req.userId!);
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await userRepo.updateUserProfile(req.userId!, req.body);
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response) => {
  try {
    let profile;
    try {
      profile = await userRepo.createUserProfile(req.userId!, {
        ...req.body,
        onboardingComplete: true,
        streak: 0,
        points: 0,
        level: 1,
        xp: 0,
      });
    } catch (error: any) {
      if (error.message?.includes('duplicate key')) {
        profile = await userRepo.updateUserProfile(req.userId!, {
          ...req.body,
          onboardingComplete: true,
        });
      } else {
        throw error;
      }
    }
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response) => {
  try {
    await userRepo.deleteUserProfile(req.userId!);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
