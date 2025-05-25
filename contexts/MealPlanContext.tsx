import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import apiService, { MealPlan } from '../services/api';
import { Alert } from 'react-native';

interface MealPlanContextType {
  mealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
  refreshMealPlan: () => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMealPlan = async () => {
    if (!user?.id) {
      console.log('No user ID available, skipping meal plan fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching meal plan for user:', user.id);
      
      // Add timeout to prevent endless loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000) // 15 second timeout
      );
      
      const fetchPromise = apiService.getMealPlan(user.id);
      
      const plan = await Promise.race([fetchPromise, timeoutPromise]) as MealPlan;
      console.log('Raw meal plan response:', JSON.stringify(plan, null, 2));
      
      if (!plan) {
        throw new Error('No meal plan data received from API');
      }
      
      if (!plan.meal_plan || !Array.isArray(plan.meal_plan.days)) {
        console.error('Invalid meal plan structure:', plan);
        throw new Error('Invalid meal plan data structure');
      }
      
      setMealPlan(plan);
      setRetryCount(0); // Reset retry count on success
      console.log('Successfully set meal plan in context');
    } catch (error: any) {
      console.error('Error fetching meal plan:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load meal plan';
      setError(errorMessage);
      setMealPlan(null);

      // If no meal plan found or server error, try creating one
      if ((error.response?.status === 404 || error.response?.status === 500 || error.message === 'Request timeout') && retryCount < 2) {
        console.log('No meal plan found, server error, or timeout - attempting to create one...');
        try {
          await apiService.createMealPlan(user.id);
          setRetryCount(prev => prev + 1);
          // Retry fetching after a short delay
          setTimeout(() => {
            fetchMealPlan();
          }, 2000);
        } catch (createError: any) {
          console.error('Error creating meal plan:', createError);
          console.error('Create error response:', createError.response?.data);
          Alert.alert(
            'Error',
            'Failed to create meal plan. Please try again later or contact support.'
          );
        }
      } else if (retryCount >= 2) {
        Alert.alert(
          'Error',
          'Unable to load your meal plan after multiple attempts. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshMealPlan = async () => {
    setRetryCount(0); // Reset retry count on manual refresh
    await fetchMealPlan();
  };

  useEffect(() => {
    if (user?.id) {
      console.log('User ID changed, fetching meal plan...');
      fetchMealPlan();
    }
  }, [user?.id]);

  return (
    <MealPlanContext.Provider value={{ mealPlan, loading, error, refreshMealPlan }}>
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (context === undefined) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
} 