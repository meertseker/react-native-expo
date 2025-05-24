import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import apiService, { MealPlan } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MealPlanContextType {
  mealPlan: MealPlan | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

const CACHE_KEY = 'mealplan_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    if (user?.id) {
      const shouldFetch = Date.now() - lastFetch > CACHE_EXPIRY;
      if (shouldFetch) {
        fetchMealPlan();
      }
    }
  }, [user]);

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setMealPlan(data);
          setLastFetch(timestamp);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error loading cached data:', error);
      return false;
    }
  };

  const cacheData = async (data: MealPlan) => {
    try {
      const timestamp = Date.now();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp }));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const fetchMealPlan = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMealPlan(user.id);
      setMealPlan(data);
      setLastFetch(Date.now());
      await cacheData(data);
    } catch (error) {
      console.error('Failed to load meal plan:', error);
      setError('Failed to load meal plan');
      // Try to load cached data as fallback
      const hasCachedData = await loadCachedData();
      if (!hasCachedData) {
        setMealPlan(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchMealPlan();
  };

  return (
    <MealPlanContext.Provider value={{ mealPlan, loading, error, refetch }}>
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