import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';

type DietaryPreferencesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DietaryPreferences'>;

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products' },
  { id: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
  { id: 'keto', label: 'Ketogenic', description: 'High-fat, low-carb' },
  { id: 'paleo', label: 'Paleo', description: 'Whole foods based' },
  { id: 'mediterranean', label: 'Mediterranean', description: 'Heart-healthy fats and whole grains' },
  { id: 'lowCarb', label: 'Low Carb', description: 'Reduced carbohydrate intake' },
  { id: 'glutenFree', label: 'Gluten Free', description: 'No gluten-containing foods' },
  { id: 'dairyFree', label: 'Dairy Free', description: 'No dairy products' },
  { id: 'none', label: 'No Restrictions', description: 'All foods included' },
];

export default function DietaryPreferences() {
  const navigation = useNavigation<DietaryPreferencesNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();
  const [selectedDiet, setSelectedDiet] = useState(formData.dietaryPreference || 'none');

  const handleNext = () => {
    updateFormData({ dietaryPreference: selectedDiet });
    navigation.navigate('MealFrequency');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mt-6 mb-8">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Dietary Preferences
          </Text>
          <Text className="text-gray-600">
            Select your preferred diet type to help us create your personalized meal plan.
          </Text>
        </View>

        {/* Diet Options */}
        <View className="mb-8">
          {dietaryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              className={`p-4 mb-3 rounded-xl border ${
                selectedDiet === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => setSelectedDiet(option.id)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`font-semibold text-lg ${
                    selectedDiet === option.id ? 'text-purple-700' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </Text>
                  <Text className={`text-sm mt-1 ${
                    selectedDiet === option.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </Text>
                </View>
                {selectedDiet === option.id && (
                  <View className="bg-purple-500 rounded-full p-2">
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="p-6 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#8A47EB] py-4 rounded-xl"
          onPress={handleNext}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 