import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';

type MealFrequencyNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealFrequency'>;

const frequencyOptions = [
  { id: '3', label: '3 Meals', description: 'Traditional breakfast, lunch, and dinner' },
  { id: '4', label: '4 Meals', description: 'Three main meals plus one snack' },
  { id: '5', label: '5 Meals', description: 'Three main meals plus two snacks' },
  { id: '6', label: '6 Meals', description: 'Frequent smaller meals throughout the day' },
];

export default function MealFrequency() {
  const navigation = useNavigation<MealFrequencyNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();

  const handleNext = () => {
    navigation.navigate('CookingSkills');
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
            Meal Frequency
          </Text>
          <Text className="text-gray-600">
            How many meals would you like to have per day?
          </Text>
        </View>

        {/* Frequency Options */}
        <View className="mb-8">
          {frequencyOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              className={`p-4 mb-3 rounded-xl border ${
                formData.mealFrequency === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => updateFormData({ mealFrequency: option.id })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className={`font-semibold text-lg ${
                    formData.mealFrequency === option.id ? 'text-purple-700' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </Text>
                  <Text className={`text-sm mt-1 ${
                    formData.mealFrequency === option.id ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </Text>
                </View>
                {formData.mealFrequency === option.id && (
                  <View className="bg-purple-500 rounded-full p-2">
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Additional Info */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <Text className="text-blue-800 font-medium mb-2">Why meal frequency matters?</Text>
          <Text className="text-blue-700 text-sm">
            • Helps maintain stable blood sugar levels{'\n'}
            • Better portion control{'\n'}
            • Improved energy throughout the day{'\n'}
            • Easier to meet nutritional goals
          </Text>
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