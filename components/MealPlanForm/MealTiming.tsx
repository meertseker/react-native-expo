import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import DateTimePicker from '@react-native-community/datetimepicker';

type MealTimingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealTiming'>;

const defaultSnackTimes = ['10:30', '15:30', '20:30'];

export default function MealTiming() {
  const navigation = useNavigation<MealTimingNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();
  const [showPicker, setShowPicker] = useState(false);
  const [currentMeal, setCurrentMeal] = useState<'breakfast' | 'lunch' | 'dinner' | null>(null);

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedTime && currentMeal) {
      const timeString = selectedTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      updateFormData({
        mealTiming: {
          ...formData.mealTiming,
          [currentMeal]: timeString
        }
      });
    }
  };

  const showTimePicker = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setCurrentMeal(meal);
    setShowPicker(true);
  };

  const handleNext = () => {
    navigation.navigate('ReviewPlan');
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
            Meal Timing
          </Text>
          <Text className="text-gray-600">
            When would you like to have your meals? This helps us plan your nutrition throughout the day.
          </Text>
        </View>

        {/* Main Meals */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Main Meals</Text>
          
          {/* Breakfast */}
          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            onPress={() => showTimePicker('breakfast')}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-900 font-medium">Breakfast</Text>
                <Text className="text-gray-500 text-sm">Current: {formData.mealTiming.breakfast}</Text>
              </View>
              <Ionicons name="time-outline" size={24} color="#8A47EB" />
            </View>
          </TouchableOpacity>

          {/* Lunch */}
          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
            onPress={() => showTimePicker('lunch')}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-900 font-medium">Lunch</Text>
                <Text className="text-gray-500 text-sm">Current: {formData.mealTiming.lunch}</Text>
              </View>
              <Ionicons name="time-outline" size={24} color="#8A47EB" />
            </View>
          </TouchableOpacity>

          {/* Dinner */}
          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl p-4"
            onPress={() => showTimePicker('dinner')}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-gray-900 font-medium">Dinner</Text>
                <Text className="text-gray-500 text-sm">Current: {formData.mealTiming.dinner}</Text>
              </View>
              <Ionicons name="time-outline" size={24} color="#8A47EB" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Snacks */}
        {parseInt(formData.mealFrequency) > 3 && (
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Snacks</Text>
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-gray-600 mb-2">Recommended snack times:</Text>
              {defaultSnackTimes.slice(0, parseInt(formData.mealFrequency) - 3).map((time, index) => (
                <Text key={index} className="text-gray-900">• {time}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <Text className="text-blue-800 font-medium mb-2">Timing Tips</Text>
          <Text className="text-blue-700 text-sm">
            • Space your meals 3-4 hours apart{'\n'}
            • Have breakfast within 2 hours of waking{'\n'}
            • Avoid heavy meals close to bedtime{'\n'}
            • Consider your work/activity schedule
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker */}
      {showPicker && (
        <DateTimePicker
          testID="timePicker"
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

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