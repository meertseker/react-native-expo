import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';

type CookingSkillsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CookingSkills'>;

const skillLevels = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Basic cooking knowledge, prefer simple recipes',
    examples: ['Can make eggs', 'Basic pasta dishes', 'Simple sandwiches']
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Comfortable in the kitchen, can follow most recipes',
    examples: ['Multiple course meals', 'Basic meat preparation', 'Various cooking methods']
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: 'Experienced cook, can handle complex recipes',
    examples: ['Complex dishes', 'Multiple techniques', 'Meal timing coordination']
  }
];

export default function CookingSkills() {
  const navigation = useNavigation<CookingSkillsNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();

  const handleNext = () => {
    navigation.navigate('MealTiming');
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
            Cooking Experience
          </Text>
          <Text className="text-gray-600">
            This helps us suggest recipes that match your comfort level in the kitchen. Don&apos;t worry, you can always level up!
          </Text>
        </View>

        {/* Skill Level Options */}
        <View className="mb-8">
          {skillLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              className={`p-4 mb-3 rounded-xl border ${
                formData.cookingSkill === level.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white'
              }`}
              onPress={() => updateFormData({ cookingSkill: level.id })}
            >
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className={`font-semibold text-lg ${
                      formData.cookingSkill === level.id ? 'text-purple-700' : 'text-gray-900'
                    }`}>
                      {level.label}
                    </Text>
                    <Text className={`text-sm mt-1 ${
                      formData.cookingSkill === level.id ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {level.description}
                    </Text>
                  </View>
                  {formData.cookingSkill === level.id && (
                    <View className="bg-purple-500 rounded-full p-2">
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  )}
                </View>
                
                {/* Examples */}
                <View className="bg-gray-50 rounded-lg p-3 mt-2">
                  <Text className="text-gray-600 text-sm font-medium mb-1">Examples:</Text>
                  {level.examples.map((example, index) => (
                    <Text key={index} className="text-gray-500 text-sm">• {example}</Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <Text className="text-blue-800 font-medium mb-2">Why this matters?</Text>
          <Text className="text-blue-700 text-sm">
            We'll adjust recipe complexity and preparation instructions based on your experience level to ensure you can successfully prepare your meals.
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