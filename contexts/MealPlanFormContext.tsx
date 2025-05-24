import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-expo';
import apiService, { UserFormData } from '../services/api';

// Types for form data
export interface FormData {
  // User basic info
  name: string;
  age?: number;
  gender?: string;
  
  // Physical data
  currentWeight: string;
  targetWeight: string;
  height: string;
  activityLevel: 'low' | 'medium' | 'high';
  
  // Allergies
  allergies: string[];
  
  // Plan type
  planType: 'balanced' | 'lowCarb' | 'highProtein';
}

// Form actions
type FormAction =
  | { type: 'SET_USER_INFO'; payload: { name: string; age?: number; gender?: string } }
  | { type: 'SET_PHYSICAL_DATA'; payload: { currentWeight: string; targetWeight: string; height: string; activityLevel: 'low' | 'medium' | 'high' } }
  | { type: 'SET_ALLERGIES'; payload: string[] }
  | { type: 'SET_PLAN_TYPE'; payload: 'balanced' | 'lowCarb' | 'highProtein' }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: FormData = {
  name: '',
  age: undefined,
  gender: undefined,
  currentWeight: '',
  targetWeight: '',
  height: '',
  activityLevel: 'medium',
  allergies: [],
  planType: 'balanced',
};

// Reducer
function formReducer(state: FormData, action: FormAction): FormData {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, ...action.payload };
    case 'SET_PHYSICAL_DATA':
      return { ...state, ...action.payload };
    case 'SET_ALLERGIES':
      return { ...state, allergies: action.payload };
    case 'SET_PLAN_TYPE':
      return { ...state, planType: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Context type
interface MealPlanFormContextType {
  formData: FormData;
  setUserInfo: (data: { name: string; age?: number; gender?: string }) => void;
  setPhysicalData: (data: { currentWeight: string; targetWeight: string; height: string; activityLevel: 'low' | 'medium' | 'high' }) => void;
  setAllergies: (allergies: string[]) => void;
  setPlanType: (planType: 'balanced' | 'lowCarb' | 'highProtein') => void;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
  isSubmitting: boolean;
}

// Create context
const MealPlanFormContext = createContext<MealPlanFormContextType | undefined>(undefined);

// Provider component
export function MealPlanFormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(formReducer, initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useUser();

  const setUserInfo = (data: { name: string; age?: number; gender?: string }) => {
    dispatch({ type: 'SET_USER_INFO', payload: data });
  };

  const setPhysicalData = (data: { currentWeight: string; targetWeight: string; height: string; activityLevel: 'low' | 'medium' | 'high' }) => {
    dispatch({ type: 'SET_PHYSICAL_DATA', payload: data });
  };

  const setAllergies = (allergies: string[]) => {
    dispatch({ type: 'SET_ALLERGIES', payload: allergies });
  };

  const setPlanType = (planType: 'balanced' | 'lowCarb' | 'highProtein') => {
    dispatch({ type: 'SET_PLAN_TYPE', payload: planType });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  const submitForm = async (): Promise<boolean> => {
    if (!user?.id) {
      console.error('User not authenticated');
      return false;
    }

    // Validate required fields
    if (!formData.currentWeight || !formData.targetWeight || !formData.height) {
      console.error('Missing required physical data');
      return false;
    }

    try {
      setIsSubmitting(true);

      // Convert activity level to backend format
      const activityFrequencyMap = {
        low: 'sedentary',
        medium: 'moderate',
        high: 'active'
      };

      // Prepare data for backend
      const backendData: UserFormData = {
        user: {
          name: formData.name || user.firstName || 'User',
          age: formData.age,
          gender: formData.gender,
          clerk_user_id: user.id,
        },
        form: {
          current_weight: parseFloat(formData.currentWeight),
          target_weight: parseFloat(formData.targetWeight),
          height: parseFloat(formData.height),
          activity_frequency: activityFrequencyMap[formData.activityLevel],
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MealPlanFormContext.Provider
      value={{
        formData,
        setUserInfo,
        setPhysicalData,
        setAllergies,
        setPlanType,
        submitForm,
        resetForm,
        isSubmitting,
      }}
    >
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