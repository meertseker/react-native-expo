import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import apiService, { DailyNutrition } from '../services/api';
import { useMealPlan } from '../contexts/MealPlanContext';

export default function Progress() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { mealPlan, loading: mealPlanLoading } = useMealPlan();
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNutritionData();
  }, [user]);

  const loadNutritionData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const nutritionData = await apiService.getDailyNutrition(user.id);
      setDailyNutrition(nutritionData);
    } catch (error) {
      console.error('Failed to load nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanMeal = () => {
    navigation.navigate('MealScanner' as never);
  };

  if (loading || mealPlanLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading your progress...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Hi, {user?.firstName || 'User'}
            </Text>
            <Text className="text-sm text-gray-500">
              {mealPlan ? 'AI Nutrition Plan' : 'No Active Plan'}
            </Text>
          </View>
          <TouchableOpacity 
            className="p-2 bg-gray-100 rounded-full"
            onPress={() => navigation.navigate('Settings' as never)}
          >
            <Feather name="settings" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {/* Daily Nutrition Summary */}
        {dailyNutrition && (
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">Today's Progress</Text>
              <TouchableOpacity onPress={loadNutritionData}>
                <Ionicons name="refresh" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {/* Calories Progress */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Calories</Text>
                <Text className="text-gray-900 font-semibold">
                  {dailyNutrition.nutrition.total_calories} / {dailyNutrition.nutrition.target_calories}
                </Text>
              </View>
              <View className="h-2 bg-gray-100 rounded-full">
                <View 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${dailyNutrition.progress.calories_percent}%` }}
                />
              </View>
            </View>

            {/* Macros Grid */}
            <View className="flex-row justify-between">
              <MacroProgress 
                label="Protein"
                current={dailyNutrition.nutrition.total_protein}
                target={dailyNutrition.nutrition.target_protein}
                percent={dailyNutrition.progress.protein_percent}
                color="bg-purple-500"
              />
              <MacroProgress 
                label="Carbs"
                current={dailyNutrition.nutrition.total_carbs}
                target={dailyNutrition.nutrition.target_carbs}
                percent={dailyNutrition.progress.carbs_percent}
                color="bg-green-500"
              />
              <MacroProgress 
                label="Fat"
                current={dailyNutrition.nutrition.total_fat}
                target={dailyNutrition.nutrition.target_fat}
                percent={dailyNutrition.progress.fat_percent}
                color="bg-yellow-500"
              />
            </View>
          </View>
        )}

        {/* Consumed Meals */}
        {dailyNutrition && dailyNutrition.consumed_meals.length > 0 && (
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Consumed Meals</Text>
            {dailyNutrition.consumed_meals.map((meal, index) => (
              <ConsumedMealCard key={meal.consumed_meal_id} meal={meal} />
            ))}
          </View>
        )}

        {/* Planned Meals */}
        {mealPlan && (
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">Planned Meals</Text>
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => navigation.navigate('MealPlan' as never)}
              >
                <Text className="text-sm text-blue-600 mr-1">View All</Text>
                <Feather name="chevron-right" size={16} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {apiService.getTodaysMeals(mealPlan).map((meal, index) => (
              <PlannedMealCard 
                key={meal.meal_id}
                meal={meal}
                time={getMealTime(index)}
              />
            ))}
          </View>
        )}

        {/* AI Assistant */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">AI Nutrition Coach</Text>
            <MaterialCommunityIcons name="robot-happy" size={24} color="#4b5563" />
          </View>

          <TouchableOpacity 
            className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3"
            onPress={() => navigation.navigate('Chat' as never)}
          >
            <Text className="text-gray-600 flex-1">What's a good post-workout snack?</Text>
            <Feather name="chevron-right" size={16} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-3 bg-gray-50 rounded-lg"
            onPress={() => navigation.navigate('Chat' as never)}
          >
            <Text className="text-gray-600 flex-1">Suggest meal alternatives</Text>
            <Feather name="chevron-right" size={16} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button - Scan Meal */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#8A47EB] p-4 rounded-full shadow-lg"
        onPress={handleScanMeal}
      >
        <MaterialCommunityIcons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function getMealTime(index: number) {
  const times = ['7:30 AM', '10:30 AM', '1:00 PM', '4:00 PM', '7:00 PM'];
  return times[index] || '12:00 PM';
}

function MacroProgress({ label, current, target, percent, color }: any) {
  return (
    <View className="flex-1 mx-1">
      <Text className="text-gray-600 text-sm mb-1">{label}</Text>
      <Text className="text-gray-900 font-semibold mb-1">
        {Math.round(current)}g / {Math.round(target)}g
      </Text>
      <View className="h-1 bg-gray-100 rounded-full">
        <View 
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </View>
    </View>
  );
}

function ConsumedMealCard({ meal }: { meal: any }) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-12 h-12 bg-gray-100 rounded-lg mr-4 items-center justify-center">
        <MaterialCommunityIcons 
          name={meal.source === 'scan' ? 'camera' : 'food'} 
          size={20} 
          color="#4b5563" 
        />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-900">{meal.meal_name}</Text>
        <Text className="text-sm text-gray-500">
          {meal.calories} cal • {meal.protein}g protein • {meal.carbs}g carbs • {meal.fat}g fat
        </Text>
        <Text className="text-xs text-gray-400">
          {new Date(meal.consumed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

function PlannedMealCard({ meal, time }: { meal: any; time: string }) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-12 h-12 bg-gray-100 rounded-lg mr-4 items-center justify-center">
        <MaterialCommunityIcons name="food-fork-drink" size={20} color="#4b5563" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-sm">{time}</Text>
        <Text className="font-medium text-gray-900">{meal.meal_name}</Text>
        <Text className="text-sm text-gray-500">
          {meal.ingredients.length} ingredients
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color="#4b5563" />
    </View>
  );
}