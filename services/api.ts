import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';

// Configure the base URL for your backend
const API_BASE_URL = 'https://mipvvnn83i.us-east-1.awsapprunner.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface User {
  id?: number;
  name: string;
  age: number | string;
  gender: string;
  clerk_user_id: string;
}

export interface Form {
  id?: number;
  user_id?: number;
  current_weight: number;
  target_weight?: number;
  height: number;
  activity_frequency?: string;
}

export interface UserFormData {
  user: User;
  form: Form;
  allergies: string[];
}

export interface Ingredient {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface Meal {
  meal_id: string;
  meal_type: string;
  meal_name: string;
  ingredients: Ingredient[];
}

export interface Day {
  day: number;
  meals: Meal[];
}

export interface GroceryItem {
  grocery_id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface MealPlan {
  meal_plan: {
    meal_plan_id: string;
    created_at: string;
    days: Day[];
  };
  grocery_list: GroceryItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FoodAnalysis {
  foods: {
    name: string;
    confidence: number;
    estimated_quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  total_calories: number;
  meal_description: string;
}

export interface ChatMessage {
  userInput: string;
  clerk_user_id?: string;
}

export interface ConsumedMeal {
  consumed_meal_id: string;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  consumed_at: string;
  source: 'scan' | 'manual' | 'planned';
  recognition_confidence?: number;
}

export interface DailyNutrition {
  date: string;
  nutrition: {
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber: number;
    target_calories: number;
    target_protein: number;
    target_carbs: number;
    target_fat: number;
    meals_consumed: number;
  };
  progress: {
    calories_percent: number;
    protein_percent: number;
    carbs_percent: number;
    fat_percent: number;
  };
  consumed_meals: ConsumedMeal[];
}

export interface MealScanResult {
  success: boolean;
  consumed_meal_id: string;
  analysis: FoodAnalysis;
  nutrition_summary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  daily_progress?: {
    total_calories: number;
    target_calories: number;
    calories_remaining: number;
    meals_consumed: number;
  };
}

export const apiService = {
  // Save user meal plan form and generate meal plan
  async saveUserMealPlanForm(data: UserFormData) {
    try {
      console.log('Sending meal plan data for user:', data.user.clerk_user_id);
      const response = await api.post('/saveUserMealPlanForm', data);
      console.log('Backend response for meal plan creation:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error saving user meal plan form:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Get user's meal plan
  async getMealPlan(clerkUserId: string): Promise<MealPlan> {
    try {
      console.log('API: Fetching meal plan for user:', clerkUserId);
      
      if (!clerkUserId) {
        throw new Error('clerk_user_id is required');
      }

      console.log('API: Making POST request to:', `${API_BASE_URL}/getMealPlan`);
      const response = await api.post('/getMealPlan', {
        clerk_user_id: clerkUserId,
      });
      
      // Log the raw response
      console.log('API: Raw response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      
      // Validate and format the response data
      const data = response.data;
      
      if (!data) {
        throw new Error('No data received from server');
      }

      console.log('API: Raw meal plan data:', JSON.stringify(data, null, 2));
      
      if (!data?.meal_plan?.days || !Array.isArray(data.meal_plan.days)) {
        console.error('API: Invalid meal plan structure:', data);
        throw new Error('Invalid meal plan data structure received from server');
      }

      // Deep clone and validate the data
      const formattedMealPlan: MealPlan = JSON.parse(JSON.stringify({
        meal_plan: {
          meal_plan_id: data.meal_plan.meal_plan_id || `mp_${Date.now()}`,
          created_at: data.meal_plan.created_at || new Date().toISOString(),
          days: data.meal_plan.days.map((day: any) => ({
            day: Number(day.day) || 1,
            meals: Array.isArray(day.meals) ? day.meals.map((meal: any) => ({
              meal_id: meal.meal_id || `meal_${Date.now()}_${Math.random()}`,
              meal_type: meal.meal_type?.toLowerCase() || 'unknown',
              meal_name: meal.meal_name || 'Unnamed Meal',
              ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.map((ing: any) => ({
                ingredient_id: ing.ingredient_id || `ing_${Date.now()}_${Math.random()}`,
                ingredient_name: ing.ingredient_name || 'Unknown Ingredient',
                quantity: Number(ing.quantity) || 0,
                unit: ing.unit?.toLowerCase() || 'g'
              })) : []
            })) : []
          }))
        },
        grocery_list: Array.isArray(data.grocery_list) ? data.grocery_list.map((item: any) => ({
          grocery_id: item.grocery_id || `grocery_${Date.now()}_${Math.random()}`,
          name: item.name || 'Unknown Item',
          quantity: Number(item.quantity) || 0,
          unit: item.unit?.toLowerCase() || 'g'
        })) : []
      }));

      console.log('API: Formatted meal plan:', JSON.stringify(formattedMealPlan, null, 2));
      return formattedMealPlan;
    } catch (error: any) {
      console.error('API: Error in getMealPlan:', error);
      console.error('API: Error response:', error.response?.data);
      console.error('API: Error status:', error.response?.status);
      
      // Enhance error message based on status code
      if (error.response?.status === 404) {
        throw new Error('No meal plan found for this user. Please create one.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw error;
    }
  },

  // Chat with AI assistant
  async chatWithBot(message: ChatMessage) {
    try {
      const response = await api.post('/chatbot', message);
      return response.data;
    } catch (error) {
      console.error('Error chatting with bot:', error);
      throw error;
    }
  },

  // Create new meal plan
  async createMealPlan(clerkUserId: string) {
    try {
      const response = await api.post('/createMealPlan', {
        clerk_user_id: clerkUserId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  },

  // Scan meal with image
  async scanMeal(clerkUserId: string, imageBase64: string, mealType?: string): Promise<MealScanResult> {
    try {
      const response = await api.post('/scanMeal', {
        clerk_user_id: clerkUserId,
        image_base64: imageBase64,
        meal_type: mealType || 'unknown',
      });
      return response.data;
    } catch (error) {
      console.error('Error scanning meal:', error);
      throw error;
    }
  },

  // Get daily nutrition data
  async getDailyNutrition(clerkUserId: string, date?: string): Promise<DailyNutrition> {
    try {
      const response = await api.post('/getDailyNutrition', {
        clerk_user_id: clerkUserId,
        date: date, // Optional: YYYY-MM-DD format
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily nutrition:', error);
      throw error;
    }
  },

  // Log meal manually
  async logMealManually(data: {
    clerkUserId: string;
    mealName: string;
    calories: number;
    mealType?: string;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  }) {
    try {
      const response = await api.post('/logMealManually', {
        clerk_user_id: data.clerkUserId,
        meal_name: data.mealName,
        meal_type: data.mealType || 'unknown',
        calories: data.calories,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
        fiber: data.fiber || 0,
      });
      return response.data;
    } catch (error) {
      console.error('Error logging meal manually:', error);
      throw error;
    }
  },

  // Calculate daily calories from meal plan
  calculateDailyCalories(mealPlan: MealPlan, day: number): number {
    const dayMeals = mealPlan.meal_plan.days.find((d: any) => d.day === day);
    if (!dayMeals) return 0;

    let totalCalories = 0;
    dayMeals.meals.forEach((meal: any) => {
      // Calculate calories based on ingredients
      meal.ingredients.forEach((ingredient: any) => {
        // Estimate calories based on ingredient quantity and standard calorie values
        const caloriesPerUnit = {
          g: 2, // 2 calories per gram as a base
          ml: 1, // 1 calorie per ml as a base
          piece: 100, // 100 calories per piece as a base
          serving: 250, // 250 calories per serving as a base
        };
        
        const unit = ingredient.unit.toLowerCase();
        const baseCalories = caloriesPerUnit[unit as keyof typeof caloriesPerUnit] || 2;
        totalCalories += ingredient.quantity * baseCalories;
      });
    });
    
    return Math.round(totalCalories);
  },

  // Get today's meals from meal plan
  getTodaysMeals(mealPlan: MealPlan): Meal[] {
    if (!mealPlan?.meal_plan?.days) return [];
    
    // Get the current day index based on when the meal plan was created
    const createdDate = new Date(mealPlan.meal_plan.created_at);
    const today = new Date();
    const daysSinceCreation = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    
    // Calculate which day of the meal plan we're on (1-based)
    const mealPlanDay = (daysSinceCreation % mealPlan.meal_plan.days.length) + 1;
    
    console.log('Getting meals for meal plan day:', mealPlanDay, {
      createdDate: createdDate.toISOString(),
      today: today.toISOString(),
      daysSinceCreation,
      totalDays: mealPlan.meal_plan.days.length
    });
    
    const dayMeals = mealPlan.meal_plan.days.find((d: Day) => d.day === mealPlanDay);
    console.log('Found day meals:', dayMeals);
    
    if (!dayMeals?.meals) {
      console.log('No meals found for calculated day, using first day as fallback');
      return mealPlan.meal_plan.days[0]?.meals || [];
    }
    
    // Sort meals by their typical times
    const mealTimes = {
      breakfast: 7.5, // 7:30 AM
      lunch: 12.5,    // 12:30 PM
      dinner: 19,     // 7:00 PM
      snack: 15,      // 3:00 PM
    };

    const sortedMeals = [...dayMeals.meals].sort((a, b) => {
      const timeA = mealTimes[a.meal_type.toLowerCase() as keyof typeof mealTimes] || 12;
      const timeB = mealTimes[b.meal_type.toLowerCase() as keyof typeof mealTimes] || 12;
      return timeA - timeB;
    });

    console.log('Sorted meals for today:', sortedMeals);
    return sortedMeals;
  },

  // Get next meal from meal plan
  getNextMeal(mealPlan: MealPlan): Meal | null {
    if (!mealPlan?.meal_plan?.days) return null;
    
    const todaysMeals = this.getTodaysMeals(mealPlan);
    if (!todaysMeals.length) return null;

    const now = new Date();
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    console.log('Current hour:', currentHour);

    const mealTimes = {
      breakfast: { start: 6, end: 10 },    // 6:00 AM - 10:00 AM
      lunch: { start: 11, end: 15 },       // 11:00 AM - 3:00 PM
      dinner: { start: 17, end: 22 },      // 5:00 PM - 10:00 PM
      snack: { start: 14, end: 17 },       // 2:00 PM - 5:00 PM
    };

    // Find the next meal based on current time
    for (const meal of todaysMeals) {
      const mealType = meal.meal_type.toLowerCase();
      const timeSlot = mealTimes[mealType as keyof typeof mealTimes];
      
      if (timeSlot && currentHour < timeSlot.end) {
        console.log('Found next meal:', meal);
        return meal;
      }
    }

    // If no meal is found for today, return tomorrow's first meal
    const createdDate = new Date(mealPlan.meal_plan.created_at);
    const today = new Date();
    const daysSinceCreation = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    const currentMealPlanDay = (daysSinceCreation % mealPlan.meal_plan.days.length) + 1;
    const tomorrowMealPlanDay = (currentMealPlanDay % mealPlan.meal_plan.days.length) + 1;
    
    console.log('Looking for tomorrow\'s meals, day:', tomorrowMealPlanDay);
    
    const tomorrowMeals = mealPlan.meal_plan.days.find((d: Day) => d.day === tomorrowMealPlanDay);
    const nextMeal = tomorrowMeals?.meals[0] || null;
    console.log('Tomorrow\'s first meal:', nextMeal);
    
    return nextMeal;
  },

  // Format meal for display
  formatMealForDisplay(meal: any): { id: string; time: string; name: string; macros: string } {
    if (!meal) return { id: '', time: '', name: '', macros: '' };

    const timeMap: { [key: string]: string } = {
      breakfast: '7:30 AM',
      lunch: '12:30 PM',
      dinner: '7:00 PM',
      snack: '3:00 PM',
    };

    // Calculate macros based on ingredients
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meal.ingredients.forEach((ingredient: any) => {
      // Estimate macros based on ingredient quantity
      const quantity = ingredient.quantity;
      const unit = ingredient.unit.toLowerCase();
      
      // Base values per unit (these are rough estimates)
      const macrosPerUnit = {
        g: { protein: 0.1, carbs: 0.15, fat: 0.05 },
        ml: { protein: 0.05, carbs: 0.1, fat: 0.03 },
        piece: { protein: 5, carbs: 8, fat: 3 },
        serving: { protein: 15, carbs: 20, fat: 10 },
      };
      
      const baseMacros = macrosPerUnit[unit as keyof typeof macrosPerUnit] || macrosPerUnit.g;
      totalProtein += quantity * baseMacros.protein;
      totalCarbs += quantity * baseMacros.carbs;
      totalFat += quantity * baseMacros.fat;
    });

    return {
      id: meal.meal_id || `meal_${Date.now()}`,
      time: timeMap[meal.meal_type.toLowerCase()] || '12:00 PM',
      name: meal.meal_name,
      macros: `${Math.round(totalProtein)}P • ${Math.round(totalCarbs)}C • ${Math.round(totalFat)}F`,
    };
  },

  // Helper to convert image to base64
  async convertImageToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove the data:image/jpeg;base64, prefix
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  },

};

export default apiService; 