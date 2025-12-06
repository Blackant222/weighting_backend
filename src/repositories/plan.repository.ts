import { supabase } from '../config/supabase';
import { DietPlan } from '../types';

export const saveDietPlan = async (userId: string, plan: DietPlan) => {
  await supabase
    .from('diet_plans')
    .update({ is_active: false })
    .eq('user_id', userId);

  const { data: planData, error: planError } = await supabase
    .from('diet_plans')
    .insert({
      user_id: userId,
      week: plan.week,
      body_composition: plan.bodyComposition,
      health_insights: plan.healthInsights,
      is_active: true,
    })
    .select()
    .single();

  if (planError) throw planError;

  for (const day of plan.days) {
    const { data: dayData, error: dayError } = await supabase
      .from('daily_plans')
      .insert({
        diet_plan_id: planData.id,
        day: day.day,
        title: day.title,
        total_calories: day.totalCalories,
        completed: day.completed,
      })
      .select()
      .single();

    if (dayError) throw dayError;

    for (let i = 0; i < day.meals.length; i++) {
      const meal = day.meals[i];
      const { error: mealError } = await supabase
        .from('meals')
        .insert({
          daily_plan_id: dayData.id,
          name: meal.name,
          type: meal.type,
          ingredients: meal.ingredients,
          instructions: meal.instructions,
          prep_time: meal.prepTime,
          calories: meal.calories,
          protein: meal.macros.protein,
          carbs: meal.macros.carbs,
          fats: meal.macros.fats,
          completed: meal.completed || false,
          sort_order: i,
        });

      if (mealError) throw mealError;
    }
  }

  return planData.id;
};

export const getActiveDietPlan = async (userId: string): Promise<DietPlan | null> => {
  const { data: planData, error: planError } = await supabase
    .from('diet_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (planError || !planData) return null;

  const { data: daysData, error: daysError } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('diet_plan_id', planData.id)
    .order('day', { ascending: true });

  if (daysError) throw daysError;

  const days = await Promise.all(
    daysData.map(async (day: any) => {
      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('daily_plan_id', day.id)
        .order('sort_order', { ascending: true });

      if (mealsError) throw mealsError;

      return {
        day: day.day,
        title: day.title,
        totalCalories: day.total_calories,
        completed: day.completed,
        meals: mealsData.map((m: any) => ({
          name: m.name,
          type: m.type,
          ingredients: m.ingredients,
          instructions: m.instructions,
          prepTime: m.prep_time,
          calories: m.calories,
          macros: {
            protein: parseFloat(m.protein),
            carbs: parseFloat(m.carbs),
            fats: parseFloat(m.fats),
          },
          completed: m.completed,
        })),
      };
    })
  );

  return {
    week: planData.week,
    bodyComposition: planData.body_composition,
    healthInsights: planData.health_insights,
    days,
  };
};

export const toggleMealCompletion = async (mealId: string) => {
  const { data: meal, error: fetchError } = await supabase
    .from('meals')
    .select('completed')
    .eq('id', mealId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('meals')
    .update({ completed: !meal.completed })
    .eq('id', mealId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
