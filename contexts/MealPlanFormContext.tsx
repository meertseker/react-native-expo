import React, { createContext, useContext, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import apiService, { UserFormData } from '../services/api';

// Types for form data
interface FormData {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  activityLevel: string;
  allergies: string[];
  dietaryPreference: string;
  mealFrequency: string;
  cookingSkill: string;
  mealTiming: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}

interface MealPlanFormContextType {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
  resetForm: () => void;
}

const defaultFormData: FormData = {
  name: '',
  age: '',
  weight: '',
  height: '',
  gender: '',
  activityLevel: '',
  allergies: [],
  dietaryPreference: 'none',
  mealFrequency: '3',
  cookingSkill: 'intermediate',
  mealTiming: {
    breakfast: '08:00',
    lunch: '13:00',
    dinner: '19:00',
    snacks: [],
  },
};

// Create context
const MealPlanFormContext = createContext<MealPlanFormContextType | undefined>(undefined);

// Provider component
export function MealPlanFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const { user } = useUser();

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const resetForm = () => {
    setFormData(defaultFormData);
  };

  const submitForm = async (): Promise<boolean> => {
    if (!user?.id) {
      console.error('User not authenticated');
      return false;
    }

    // Validate required fields
    if (!formData.weight || !formData.height) {
      console.error('Missing required physical data');
      return false;
    }

    try {
      // Prepare data for backend
      const backendData: UserFormData = {
        user: {
          name: formData.name || user.firstName || 'User',
          age: formData.age,
          gender: formData.gender,
          clerk_user_id: user.id,
        },
        form: {
          current_weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
        },
        allergies: formData.allergies,
      };

      // Submit to backend
      const result = await apiService.saveUserMealPlanForm(backendData);
      console.log('Form submitted successfully:', result);
      
      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  return (
    <MealPlanFormContext.Provider value={{ formData, updateFormData, resetForm }}>
      {children}
    </MealPlanFormContext.Provider>
  );
}

// Hook to use the context
export function useMealPlanForm() {
  const context = useContext(MealPlanFormContext);
  if (context === undefined) {
    throw new Error('useMealPlanForm must be used within a MealPlanFormProvider');
  }
  return context;
} 