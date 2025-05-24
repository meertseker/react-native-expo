import axios from 'axios';
import { useUser } from '@clerk/clerk-expo';

// Configure the base URL for your backend
const API_BASE_URL = 'http://localhost:5000'; // Change this to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UserFormData {
  user: {
    name: string;
    age?: number;
    gender?: string;
    clerk_user_id: string;
  };
  form: {
    current_weight: number;
    target_weight: number;
    height: number;
    activity_frequency: string;
  };
  allergies: string[];
}

export interface MealPlan {
  meal_plan: {
    meal_plan_id: string;
    created_at: string;
    days: Array<{
      day: number;
      meals: Array<{
        meal_id: string;
        meal_type: string;
        meal_name: string;
        ingredients: Array<{
          ingredient_id: string;
          ingredient_name: string;
          quantity: number;
          unit: string;
        }>;
      }>;
    }>;
  };
  grocery_list: Array<{
    grocery_id: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
}

export interface ChatMessage {
  userInput: string;
  clerk_user_id?: string;
}

export const apiService = {
  // Save user meal plan form and generate meal plan
  async saveUserMealPlanForm(data: UserFormData) {
    try {
      const response = await api.post('/saveUserMealPlanForm', data);
      return response.data;
    } catch (error) {
      console.error('Error saving user meal plan form:', error);
      throw error;
    }
  },

  // Get user's meal plan
  async getMealPlan(clerkUserId: string): Promise<MealPlan> {
    try {
      const response = await api.post('/getMealPlan', {
        clerk_user_id: clerkUserId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching meal plan:', error);
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

  // Calculate daily calories from meal plan
  calculateDailyCalories(mealPlan: MealPlan, day: number): number {
    const dayMeals = mealPlan.meal_plan.days.find(d => d.day === day);
    if (!dayMeals) return 0;

    // This is a simplified calculation - you might want to enhance this
    // by fetching actual calorie data from ingredients
    let totalCalories = 0;
    dayMeals.meals.forEach(meal => {
      // Estimate calories based on meal type and ingredients
      const ingredientCount = meal.ingredients.length;
      switch (meal.meal_type.toLowerCase()) {
        case 'breakfast':
          totalCalories += ingredientCount * 100;
          break;
        case 'lunch':
          totalCalories += ingredientCount * 150;
          break;
        case 'dinner':
          totalCalories += ingredientCount * 140;
          break;
        case 'snack':
          totalCalories += ingredientCount * 80;
          break;
        default:
          totalCalories += ingredientCount * 120;
      }
    });
    return Math.round(totalCalories);
  },

  // Get today's meals from meal plan
  getTodaysMeals(mealPlan: MealPlan): Array<any> {
    const today = new Date().getDay() || 7; // Convert Sunday (0) to 7
    const dayMeals = mealPlan.meal_plan.days.find(d => d.day === today);
    return dayMeals?.meals || [];
  },

  // Format meal for display
  formatMealForDisplay(meal: any): { time: string; name: string; macros: string } {
    const timeMap: { [key: string]: string } = {
      breakfast: '7:30 AM',
      lunch: '12:30 PM',
      dinner: '7:00 PM',
      snack: '3:00 PM',
    };

    const ingredientCount = meal.ingredients.length;
    const estimatedProtein = Math.round(ingredientCount * 8);
    const estimatedCarbs = Math.round(ingredientCount * 12);
    const estimatedFat = Math.round(ingredientCount * 6);

    return {
      time: timeMap[meal.meal_type.toLowerCase()] || '12:00 PM',
      name: meal.meal_name,
      macros: `${estimatedProtein}P • ${estimatedCarbs}C • ${estimatedFat}F`,
    };
  },
};

export default apiService; 