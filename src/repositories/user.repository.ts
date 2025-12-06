import { supabase } from '../config/supabase';
import { UserProfile } from '../types';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data ? mapDbToProfile(data) : null;
};

export const createUserProfile = async (userId: string, profile: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userId,
      ...mapProfileToDb(profile),
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbToProfile(data);
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...mapProfileToDb(updates), updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return mapDbToProfile(data);
};

export const deleteUserProfile = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};

const mapDbToProfile = (data: any): UserProfile => ({
  name: data.name,
  age: data.age,
  gender: data.gender,
  weight: parseFloat(data.weight),
  height: parseFloat(data.height),
  country: data.country,
  goalWeight: data.goal_weight ? parseFloat(data.goal_weight) : undefined,
  goalRationale: data.goal_rationale,
  activityLevel: data.activity_level,
  dietaryPreferences: data.dietary_preferences || [],
  allergies: data.allergies || [],
  mealsPerDay: data.meals_per_day,
  primaryGoal: data.primary_goal,
  streak: data.streak,
  points: data.points,
  level: data.level,
  xp: data.xp,
  onboardingComplete: data.onboarding_complete,
  language: data.language,
});

const mapProfileToDb = (profile: Partial<UserProfile>) => ({
  name: profile.name,
  age: profile.age,
  gender: profile.gender,
  weight: profile.weight,
  height: profile.height,
  country: profile.country,
  goal_weight: profile.goalWeight,
  goal_rationale: profile.goalRationale,
  activity_level: profile.activityLevel,
  dietary_preferences: profile.dietaryPreferences,
  allergies: profile.allergies,
  meals_per_day: profile.mealsPerDay,
  primary_goal: profile.primaryGoal,
  streak: profile.streak,
  points: profile.points,
  level: profile.level,
  xp: profile.xp,
  onboarding_complete: profile.onboardingComplete,
  language: profile.language,
});
