import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface QuickStartOnboardingProps {
  onComplete?: (data: OnboardingData) => void;
}

interface OnboardingData {
  goal: 'lose_fat' | 'build_muscle' | 'maintain' | 'athletic';
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export default function QuickStartOnboarding({ onComplete }: QuickStartOnboardingProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  const goals = [
    {
      id: 'lose_fat' as const,
      title: '🔥 Lose Fat',
      description: 'Burn fat while maintaining muscle',
      color: '#FF6B6B',
    },
    {
      id: 'build_muscle' as const,
      title: '💪 Build Muscle',
      description: 'Gain lean muscle mass',
      color: '#10B981',
    },
    {
      id: 'maintain' as const,
      title: '⚖️ Maintain',
      description: 'Maintain current physique',
      color: '#8A47EB',
    },
    {
      id: 'athletic' as const,
      title: '🏃 Athletic',
      description: 'Optimize for performance',
      color: '#3B82F6',
    },
  ];

  const activityLevels = [
    { id: 'sedentary' as const, label: 'Sedentary', description: 'Desk job, little exercise' },
    { id: 'light' as const, label: 'Light', description: 'Light exercise 1-3x/week' },
    { id: 'moderate' as const, label: 'Moderate', description: 'Exercise 3-5x/week' },
    { id: 'active' as const, label: 'Active', description: 'Exercise 6-7x/week' },
    { id: 'very_active' as const, label: 'Very Active', description: 'Physical job + exercise' },
  ];

  const handleGoalSelect = (goal: OnboardingData['goal']) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFormData({ ...formData, goal });
    setTimeout(() => setStep(2), 300);
  };

  const handleNext = () => {
    if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleCreatePlan();
    }
  };

  const handleCreatePlan = async () => {
    if (!formData.goal || !formData.weight || !formData.activity) return;
    
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (onComplete) {
        onComplete(formData as OnboardingData);
      } else {
        // Default behavior - navigate to main app
        navigation.navigate('MainTabs');
      }
    }, 2000);
  };

  const isStep2Valid = formData.weight && formData.weight > 0;
  const isStep3Valid = isStep2Valid && formData.activity;

  // Step 1: Goal Selection
  if (step === 1) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 px-6 py-8">
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              🎯 What's your main goal?
            </Text>
            <Text className="text-gray-500 text-center mb-8">
              Takes 30 seconds to create your personalized meal plan
            </Text>
          </Animated.View>

          <View className="flex-1 justify-center">
            <View className="space-y-4">
              {goals.map((goal, index) => (
                <Animated.View 
                  key={goal.id}
                  entering={FadeInRight.delay(300 + index * 100).springify()}
                >
                  <TouchableOpacity
                    className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent"
                    onPress={() => handleGoalSelect(goal.id)}
                    style={{
                      shadowColor: goal.color,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View 
                        className="w-16 h-16 rounded-2xl items-center justify-center mr-4"
                        style={{ backgroundColor: `${goal.color}15` }}
                      >
                        <Text className="text-2xl">{goal.title.split(' ')[0]}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-900 mb-1">
                          {goal.title.split(' ').slice(1).join(' ')}
                        </Text>
                        <Text className="text-gray-500">
                          {goal.description}
                        </Text>
                      </View>
                      <Icon name="chevron-right" size={24} color={goal.color} />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Quick Info
  if (step === 2) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 px-6 py-8">
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
              Quick info for your meal plan:
            </Text>
            <Text className="text-gray-500 text-center mb-8">
              We'll customize everything else based on your goal
            </Text>
          </Animated.View>

          <View className="flex-1 justify-center space-y-8">
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Text className="text-lg font-semibold text-gray-900 mb-4">Weight (kg)</Text>
              <TextInput
                className="bg-white rounded-xl p-4 text-xl font-semibold text-center shadow-sm"
                placeholder="70"
                keyboardType="numeric"
                value={formData.weight?.toString() || ''}
                onChangeText={(text) => setFormData({ ...formData, weight: parseInt(text) || 0 })}
                style={{
                  borderWidth: 2,
                  borderColor: formData.weight ? '#8A47EB' : '#E5E7EB',
                }}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <Text className="text-lg font-semibold text-gray-900 mb-4">Activity Level</Text>
              <View className="space-y-3">
                {activityLevels.map((level, index) => (
                  <TouchableOpacity
                    key={level.id}
                    className={`bg-white rounded-xl p-4 border-2 ${
                      formData.activity === level.id ? 'border-[#8A47EB]' : 'border-gray-200'
                    }`}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setFormData({ ...formData, activity: level.id });
                    }}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="font-semibold text-gray-900">{level.label}</Text>
                        <Text className="text-sm text-gray-500">{level.description}</Text>
                      </View>
                      {formData.activity === level.id && (
                        <Icon name="check-circle" size={24} color="#8A47EB" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                isStep2Valid ? 'bg-[#8A47EB]' : 'bg-gray-300'
              }`}
              onPress={handleNext}
              disabled={!isStep2Valid}
            >
              <Text className="text-white font-bold text-lg">
                ✨ Create My Plan
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: Loading & Success
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-8 justify-center items-center">
        {loading ? (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View className="items-center">
              <ActivityIndicator size="large" color="#8A47EB" />
              <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                Creating your meal plan...
              </Text>
              <Text className="text-gray-500 text-center">
                Analyzing your goals and preferences
              </Text>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View className="items-center">
              <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
                <Icon name="check" size={48} color="#10B981" />
              </View>
              
              <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
                🎉 Your meal plan is ready!
              </Text>
              
              <View className="bg-white rounded-xl p-6 shadow-sm mb-8 w-full">
                <View className="space-y-3">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">📊</Text>
                    <Text className="text-gray-900 font-medium">2,100 calories/day</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">🍽️</Text>
                    <Text className="text-gray-900 font-medium">5 meals automatically planned</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">🛒</Text>
                    <Text className="text-gray-900 font-medium">Grocery list generated</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                className="bg-[#8A47EB] rounded-xl py-4 px-8 items-center w-full"
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Text className="text-white font-bold text-lg">
                  See Today's Meals
                </Text>
              </TouchableOpacity>
              
              <Text className="text-gray-500 text-center mt-4">
                💡 Customize anytime in settings
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
} 