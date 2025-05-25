import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type DietaryPreferencesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DietaryPreferences'>;

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish', icon: 'leaf', color: '#10B981' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products', icon: 'sprout', color: '#059669' },
  { id: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat', icon: 'fish', color: '#0891B2' },
  { id: 'keto', label: 'Ketogenic', description: 'High-fat, low-carb', icon: 'fire', color: '#F59E0B' },
  { id: 'paleo', label: 'Paleo', description: 'Whole foods based', icon: 'food-drumstick', color: '#D97706' },
  { id: 'mediterranean', label: 'Mediterranean', description: 'Heart-healthy fats and whole grains', icon: 'food-apple', color: '#7C3AED' },
  { id: 'lowCarb', label: 'Low Carb', description: 'Reduced carbohydrate intake', icon: 'minus-circle', color: '#DC2626' },
  { id: 'glutenFree', label: 'Gluten Free', description: 'No gluten-containing foods', icon: 'close-circle', color: '#F97316' },
  { id: 'dairyFree', label: 'Dairy Free', description: 'No dairy products', icon: 'cup-off', color: '#EC4899' },
  { id: 'none', label: 'No Restrictions', description: 'All foods included', icon: 'check-all', color: '#6B7280' },
];

export default function DietaryPreferences() {
  const navigation = useNavigation<DietaryPreferencesNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();
  const [selectedDiet, setSelectedDiet] = useState(formData.dietaryPreference || 'none');

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateFormData({ dietaryPreference: selectedDiet });
    navigation.navigate('MealFrequency');
  };

  const handleDietSelect = (dietId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDiet(dietId);
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateFormData({ dietaryPreference: 'none' });
    navigation.navigate('MealFrequency');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-[#8A47EB] font-semibold text-lg">Skip</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Diet Style 🥗
          </Text>
          <Text className="text-gray-500 text-lg">
            This helps us tailor meals to your lifestyle
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
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
          </View>
          <Text className="text-sm text-gray-500">Step 3 of 4</Text>
        </Animated.View>

        {/* Diet Options */}
        <View className="px-6 py-4">
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-4">Popular Diet Types</Text>
          </Animated.View>

          <View className="space-y-3">
            {dietaryOptions.map((option, index) => (
              <Animated.View 
                key={option.id}
                entering={FadeInDown.delay(400 + index * 50).springify()}
              >
                <TouchableOpacity
                  className={`bg-white p-4 rounded-xl border-2 ${
                    selectedDiet === option.id
                      ? 'border-[#8A47EB] shadow-lg'
                      : 'border-gray-200 shadow-sm'
                  }`}
                  onPress={() => handleDietSelect(option.id)}
                  style={{
                    shadowColor: selectedDiet === option.id ? '#8A47EB' : '#000',
                    shadowOpacity: selectedDiet === option.id ? 0.15 : 0.05,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: selectedDiet === option.id ? 8 : 2,
                  }}
                >
                  <View className="flex-row items-center">
                    <View 
                      className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                        selectedDiet === option.id ? 'bg-purple-50' : 'bg-gray-100'
                      }`}
                    >
                      <Icon 
                        name={option.icon as any}
                        size={24}
                        color={selectedDiet === option.id ? '#8A47EB' : option.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold text-lg ${
                        selectedDiet === option.id ? 'text-[#8A47EB]' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </Text>
                      <Text className={`text-sm mt-1 ${
                        selectedDiet === option.id ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {option.description}
                      </Text>
                    </View>
                    {selectedDiet === option.id && (
                      <View className="w-6 h-6 bg-[#8A47EB] rounded-full items-center justify-center">
                        <Icon name="check" size={14} color="white" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <View className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
              <View className="flex-row items-center mb-2">
                <Icon name="lightbulb" size={20} color="#10B981" />
                <Text className="text-green-900 font-semibold ml-2">Tip</Text>
              </View>
              <Text className="text-green-800 text-sm">
                Don't worry - you can always change your dietary preference later in settings. 
                We'll customize your meal suggestions based on your choice.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Button */}
      <Animated.View 
        entering={FadeInDown.delay(900).springify()}
        className="px-6 py-4 bg-white border-t border-gray-200"
      >
        <TouchableOpacity
          className="bg-[#8A47EB] py-4 rounded-xl items-center shadow-lg"
          onPress={handleNext}
          style={{
            shadowColor: '#8A47EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-lg mr-2">Continue</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
} 