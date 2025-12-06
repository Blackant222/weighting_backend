import { Type } from '@google/genai';
import { ai, FAST_MODEL } from '../config/gemini';
import { UserProfile, DietPlan } from '../types';

const getLangInstruction = (profile: any) => {
  if (profile.language === 'es') return "IMPORTANT: Respond STRICTLY in Spanish (Español).";
  if (profile.language === 'fa') return "IMPORTANT: Respond STRICTLY in Persian (Farsi). Use a friendly, informal tone.";
  return "Respond in English.";
};

export const suggestGoalWeight = async (
  profile: any,
  imageBase64: string | null
): Promise<{ suggestedWeight: number; rationale: string }> => {
  try {
    const langInstruction = getLangInstruction(profile);
    const prompt = `
      Act as a supportive but realistic gym bro. Suggest a healthy goal weight for a ${profile.age}yo ${profile.gender}, current weight ${profile.weight}kg, height ${profile.height}cm.
      Activity Level: ${profile.activityLevel}.
      Primary Goal: ${profile.primaryGoal}.
      Country: ${profile.country}.
      ${imageBase64 ? "I have attached a photo of my current physique. Estimate body fat." : ""}
      Return JSON only: {suggestedWeight: number, rationale: string}.
      ${langInstruction}
    `;
    
    const parts: any[] = [{ text: prompt }];
    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } });
    }

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedWeight: { type: Type.NUMBER },
            rationale: { type: Type.STRING },
          },
          required: ["suggestedWeight", "rationale"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error suggesting goal:", error);
    const targetWeight = profile.primaryGoal === 'Weight Loss' 
      ? Math.round(profile.weight * 0.9) 
      : Math.round(profile.weight * 1.1);
    return {
      suggestedWeight: targetWeight,
      rationale: profile.language === 'fa' 
        ? "هدف پیشنهادی بر اساس وزن و قد شما" 
        : `Suggested goal based on your ${profile.primaryGoal.toLowerCase()} target`,
    };
  }
};

export const generateInitialPlan = async (
  profile: UserProfile,
  imageBase64: string | null
): Promise<DietPlan> => {
  const langInstruction = getLangInstruction(profile);

  const systemInstruction = `
    You are 'BroBot'. Generate EXACTLY a 7-day diet plan.
    User Country: ${profile.country}. Avoid culturally taboo/hard-to-find ingredients for this country.
    Meal Structure: "${profile.mealsPerDay}".
    ${langInstruction}
    Output strict JSON with EXACTLY 7 days.
  `;

  const userContext = JSON.stringify({
    ...profile,
    streak: undefined,
    points: undefined,
    onboardingComplete: undefined
  });

  const prompt = `Analyze: ${userContext}. ${imageBase64 ? "Use attached image for body composition." : ""} Create Week 1 Plan with EXACTLY 7 days.
  
  EXAMPLE OUTPUT:
  {
    "week": 1,
    "bodyComposition": {
      "estimatedBodyFat": 18.5,
      "muscleMassEstimate": 65.2,
      "postureNotes": "Good posture, solid foundation bro!"
    },
    "healthInsights": [
      "Drink 3L water daily",
      "Get 7-8 hours sleep",
      "Track your meals"
    ],
    "days": [
      {
        "day": 1,
        "title": "Day 1",
        "totalCalories": 2200,
        "completed": false,
        "meals": [
          {
            "name": "Protein Oats",
            "type": "Breakfast",
            "ingredients": ["Oats 80g", "Protein powder 30g", "Banana"],
            "instructions": ["Mix oats with water", "Add protein powder", "Top with banana"],
            "prepTime": "5 min",
            "calories": 450,
            "completed": false,
            "macros": {"protein": 35, "carbs": 60, "fats": 10}
          }
        ]
      }
    ]
  }
  
  Generate EXACTLY 7 days like this.`;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } });
  }

  const response = await ai.models.generateContent({
    model: FAST_MODEL,
    contents: { parts },
    config: {
      systemInstruction,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER },
          bodyComposition: {
            type: Type.OBJECT,
            properties: {
              estimatedBodyFat: { type: Type.NUMBER },
              muscleMassEstimate: { type: Type.NUMBER },
              postureNotes: { type: Type.STRING },
            },
            required: ["estimatedBodyFat", "muscleMassEstimate", "postureNotes"]
          },
          healthInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                title: { type: Type.STRING },
                totalCalories: { type: Type.NUMBER },
                completed: { type: Type.BOOLEAN },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING },
                      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                      instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      prepTime: { type: Type.STRING },
                      calories: { type: Type.NUMBER },
                      completed: { type: Type.BOOLEAN },
                      macros: {
                        type: Type.OBJECT,
                        properties: {
                          protein: { type: Type.NUMBER },
                          carbs: { type: Type.NUMBER },
                          fats: { type: Type.NUMBER },
                        },
                        required: ["protein", "carbs", "fats"]
                      }
                    },
                    required: ["name", "type", "ingredients", "instructions", "prepTime", "calories", "macros"]
                  }
                }
              },
              required: ["day", "title", "totalCalories", "completed", "meals"]
            }
          }
        },
        required: ["week", "bodyComposition", "healthInsights", "days"]
      }
    }
  });

  const plan = JSON.parse(response.text || "{}");
  
  if (!plan.days || plan.days.length !== 7) {
    throw new Error(`AI returned ${plan.days?.length || 0} days instead of 7`);
  }
  
  return plan;
};

export const generateNextPhasePlan = async (
  currentProfile: UserProfile,
  newWeight: number,
  mood: number,
  feedback: string,
  imageBase64: string | null,
  currentWeek: number
): Promise<DietPlan> => {
  const langInstruction = getLangInstruction(currentProfile);
  const updatedProfile = { ...currentProfile, weight: newWeight };

  const systemInstruction = `
    You are 'BroBot'. Generate Week ${currentWeek + 1} diet plan based on progress.
    User Country: ${currentProfile.country}. Avoid culturally taboo/hard-to-find ingredients.
    Meal Structure: "${currentProfile.mealsPerDay}".
    ${langInstruction}
    Output strict JSON.
  `;

  const prompt = `
    Week ${currentWeek} Complete!
    Previous Weight: ${currentProfile.weight}kg → New Weight: ${newWeight}kg
    Energy Level: ${mood}/10
    User Feedback: "${feedback}"
    ${imageBase64 ? "Progress photo attached." : ""}
    
    Generate optimized Week ${currentWeek + 1} plan.
  `;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } });
  }

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            week: { type: Type.INTEGER },
            bodyComposition: {
              type: Type.OBJECT,
              properties: {
                estimatedBodyFat: { type: Type.NUMBER },
                muscleMassEstimate: { type: Type.NUMBER },
                postureNotes: { type: Type.STRING },
              }
            },
            healthInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  totalCalories: { type: Type.NUMBER },
                  completed: { type: Type.BOOLEAN },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        prepTime: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        macros: {
                          type: Type.OBJECT,
                          properties: {
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER },
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Next phase generation error", error);
    throw error;
  }
};

export const chatWithNutritionist = async (
  history: { role: string; parts: any[] }[],
  message: string,
  userContext: UserProfile,
  dietPlan: DietPlan | null,
  image?: string | null
): Promise<string> => {
  try {
    const langInstruction = getLangInstruction(userContext);
    
    let planContext = "No active plan.";
    if (dietPlan) {
      const currentDay = dietPlan.days.find(d => !d.completed) || dietPlan.days[dietPlan.days.length - 1];
      const completedMeals = currentDay?.meals.filter(m => m.completed).map(m => m.name).join(", ") || "None";
      const remainingMeals = currentDay?.meals.filter(m => !m.completed).map(m => m.name).join(", ") || "None";
      
      planContext = `
        Current Plan Week: ${dietPlan.week}.
        Today is Day ${currentDay?.day}.
        Calories Target: ${currentDay?.totalCalories}.
        Meals Eaten So Far: ${completedMeals}.
        Meals Left: ${remainingMeals}.
      `;
    }

    const systemInstruction = `
      You are 'BroBot', a gym-bro AI nutritionist. 
      ${langInstruction} 
      
      USER CONTEXT:
      Name: ${userContext.name}
      Current Weight: ${userContext.weight}kg
      Goal Weight: ${userContext.goalWeight}kg
      Country: ${userContext.country}
      
      DIET CONTEXT:
      ${planContext}

      INSTRUCTIONS:
      - If the user sends a food photo, analyze macros roughly.
      - If the user asks "What's next?", look at the 'Meals Left' in context.
      - Be supportive but keep it real. Use emojis.
      - Keep responses concise (under 3 sentences unless asked for detail).
    `;

    const parts: any[] = [{ text: systemInstruction + "\n\nUser: " + (message || "Hi") }];
    
    if (image) {
      const cleanBase64 = image.split(',')[1] || image;
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } });
    }

    const result = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: { parts }
    });

    return result.text || "....";
  } catch (e: any) {
    console.error('Chat error:', e);
    const errorMsg = e?.message || '';
    if (errorMsg.includes('location') || errorMsg.includes('FAILED_PRECONDITION')) {
      return userContext.language === 'fa' 
        ? "متاسفانه API در منطقه شما فعال نیست. لطفا VPN خود را بررسی کنید."
        : "Gemini API not available in your region. Please check your VPN settings.";
    }
    return userContext.language === 'fa' ? "اینترنت یاری نمیکنه داداش." : "Connection dropped, bro.";
  }
};
