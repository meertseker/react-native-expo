import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type FinalScreenProps = NativeStackNavigationProp<RootStackParamList, 'Final'>;

const FinalScreen: React.FC = () => {
  const navigation = useNavigation<FinalScreenProps>();
  const { formData, updateFormData } = useMealPlanForm();
  
  const [planType, setPlanTypeState] = useState<'balanced' | 'lowCarb' | 'highProtein'>(
    (formData as any).planType || 'balanced'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planTypes = [
    {
      id: 'balanced' as const,
      name: 'Balanced Nutrition',
      description: 'Carbs, protein and fats distributed evenly. Ideal for general health.',
      icon: 'scale-balance',
      color: '#10B981',
      benefits: ['Sustainable long-term', 'Energy balance', 'Nutrient variety']
    },
    {
      id: 'lowCarb' as const,
      name: 'Low Carb',
      description: 'Limited carbs, increased protein and healthy fats. Effective for weight loss.',
      icon: 'minus-circle',
      color: '#F59E0B',
      benefits: ['Faster weight loss', 'Stable blood sugar', 'Reduced cravings']
    },
    {
      id: 'highProtein' as const,
      name: 'High Protein',
      description: 'Protein-focused nutrition plan. Great for muscle building and sports performance.',
      icon: 'dumbbell',
      color: '#8B5CF6',
      benefits: ['Muscle development', 'Better recovery', 'Enhanced performance']
    }
  ];

  const handlePlanTypeChange = (type: 'balanced' | 'lowCarb' | 'highProtein') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPlanTypeState(type);
    updateFormData({ planType: type } as any);
  };

  const handleFinish = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success! 🎉',
        'Your personalized meal plan has been created successfully! You can now view it on the home screen.',
        [
          {
            text: 'View My Plan',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating meal plan:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlan = planTypes.find(p => p.id === planType);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-6 pb-4"
        >
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm mb-6"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Almost There! 🎯
          </Text>
          <Text className="text-gray-500 text-lg">
            Choose your nutrition plan type and let's create your personalized meal plan
          </Text>
        </Animated.View>

        {/* Progress Indicator */}
        <Animated.View 
          entering={FadeInRight.delay(200).springify()}
          className="px-6 py-4"
        >
          <View className="flex-row items-center mb-2">
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full" />
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full ml-2" />
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full ml-2" />
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full ml-2" />
          </View>
          <Text className="text-sm text-gray-500">Step 4 of 4 - Final Step!</Text>
        </Animated.View>

        <View className="px-6 py-4">
          {/* Plan Type Selection */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan Type</Text>
          </Animated.View>

          <View className="space-y-4 mb-8">
            {planTypes.map((plan, index) => (
              <Animated.View 
                key={plan.id}
                entering={FadeInDown.delay(400 + index * 100).springify()}
              >
                <TouchableOpacity 
                  className={`bg-white p-4 rounded-xl border-2 ${
                    planType === plan.id ? 'border-[#8A47EB] shadow-lg' : 'border-gray-200 shadow-sm'
                  }`}
                  onPress={() => handlePlanTypeChange(plan.id)}
                  style={{
                    shadowColor: planType === plan.id ? '#8A47EB' : '#000',
                    shadowOpacity: planType === plan.id ? 0.15 : 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: planType === plan.id ? 8 : 2,
                  }}
                >
                  <View className="flex-row items-start">
                    <View 
                      className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                        planType === plan.id ? 'bg-purple-50' : 'bg-gray-100'
                      }`}
                    >
                      <Icon 
                        name={plan.icon as any}
                        size={24}
                        color={planType === plan.id ? '#8A47EB' : plan.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold text-lg ${
                        planType === plan.id ? 'text-[#8A47EB]' : 'text-gray-900'
                      }`}>
                        {plan.name}
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1 mb-3">
                        {plan.description}
                      </Text>
                      <View className="flex-row flex-wrap">
                        {plan.benefits.map((benefit, idx) => (
                          <View key={idx} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1">
                            <Text className="text-xs text-gray-600">{benefit}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    {planType === plan.id && (
                      <View className="w-6 h-6 bg-[#8A47EB] rounded-full items-center justify-center">
                        <Icon name="check" size={14} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Plan Summary */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-4">Your Plan Summary</Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <View className="space-y-3">
                {formData.name && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Name:</Text>
                    <Text className="text-sm font-medium text-gray-900">{formData.name}</Text>
                  </View>
                )}
                {formData.weight && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Weight:</Text>
                    <Text className="text-sm font-medium text-gray-900">{formData.weight} kg</Text>
                  </View>
                )}
                {formData.height && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Height:</Text>
                    <Text className="text-sm font-medium text-gray-900">{formData.height} cm</Text>
                  </View>
                )}
                {formData.dietaryPreference && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Diet Type:</Text>
                    <Text className="text-sm font-medium text-gray-900">{formData.dietaryPreference}</Text>
                  </View>
                )}
                {formData.allergies && formData.allergies.length > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">Allergies:</Text>
                    <Text className="text-sm font-medium text-gray-900">{formData.allergies.join(', ')}</Text>
                  </View>
                )}
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500">Plan Type:</Text>
                  <Text className="text-sm font-medium text-[#8A47EB]">{selectedPlan?.name}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* What You'll Get */}
          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
              <View className="flex-row items-center mb-3">
                <Icon name="gift" size={20} color="#10B981" />
                <Text className="text-green-900 font-semibold ml-2">What You'll Get</Text>
              </View>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Icon name="check" size={16} color="#10B981" />
                  <Text className="text-green-800 text-sm ml-2">7-day personalized meal plan</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="check" size={16} color="#10B981" />
                  <Text className="text-green-800 text-sm ml-2">Detailed ingredient lists for each meal</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="check" size={16} color="#10B981" />
                  <Text className="text-green-800 text-sm ml-2">Automatic grocery shopping list</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="check" size={16} color="#10B981" />
                  <Text className="text-green-800 text-sm ml-2">Daily calories and macro tracking</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="check" size={16} color="#10B981" />
                  <Text className="text-green-800 text-sm ml-2">AI-powered nutrition recommendations</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Buttons */}
      <Animated.View 
        entering={FadeInDown.delay(900).springify()}
        className="px-6 py-4 bg-white border-t border-gray-200"
      >
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text className="text-gray-700 font-semibold">Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-2 bg-[#8A47EB] py-4 rounded-xl items-center shadow-lg"
            onPress={handleFinish}
            disabled={isSubmitting}
            style={{
              shadowColor: '#8A47EB',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">Creating...</Text>
                </>
              ) : (
                <>
                  <Text className="text-white font-bold text-lg mr-2">🎉 Create My Plan</Text>
                  <Icon name="arrow-right" size={20} color="white" />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default FinalScreen;