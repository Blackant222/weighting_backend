export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  PreferNotToSay = 'Prefer not to say',
}

export enum ActivityLevel {
  Sedentary = 'Sedentary',
  LightlyActive = 'Lightly active',
  ModeratelyActive = 'Moderately active',
  VeryActive = 'Very active',
}

export type Language = 'en' | 'es' | 'fa';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  country: string;
  goalWeight?: number;
  goalRationale?: string;
  activityLevel?: ActivityLevel;
  dietaryPreferences: string[];
  allergies: string[];
  mealsPerDay: string;
  primaryGoal: string;
  streak: number;
  points: number;
  level: number;
  xp: number;
  onboardingComplete: boolean;
  language: Language;
}

export interface MacroBreakdown {
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  calories: number;
  macros: MacroBreakdown;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-Workout' | 'Post-Workout';
  completed?: boolean;
}

export interface DailyPlan {
  day: number;
  title: string;
  meals: Meal[];
  totalCalories: number;
  completed: boolean;
}

export interface DietPlan {
  week: number;
  bodyComposition: {
    estimatedBodyFat: number;
    muscleMassEstimate: number;
    postureNotes: string;
  };
  healthInsights: string[];
  days: DailyPlan[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
}
