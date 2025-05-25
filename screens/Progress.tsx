import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import apiService, { DailyNutrition } from '../services/api';
import { useMealPlan } from '../contexts/MealPlanContext';
import { RootStackParamList } from '../App';

type ProgressScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Progress() {
  const { user } = useUser();
  const navigation = useNavigation<ProgressScreenNavigationProp>();
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
            onPress={() => navigation.navigate('MainTabs', { screen: 'Settings' })}
          >
            <Feather name="settings" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {/* Daily Nutrition Summary */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Daily Nutrition</Text>
          
          {dailyNutrition && (
            <>
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-3xl font-bold text-gray-900">
                    {dailyNutrition.nutrition.total_calories}/{dailyNutrition.nutrition.target_calories}
                  </Text>
                  <Text className="text-gray-500">Calories Today</Text>
                </View>
                <View className="w-20 h-20 rounded-full border-4 border-gray-200 items-center justify-center relative">
                  <View 
                    className="absolute w-20 h-20 rounded-full border-4"
                    style={{
                      transform: [{ rotate: `${(dailyNutrition.progress.calories_percent * 3.6)}deg` }],
                      borderColor: dailyNutrition.progress.calories_percent >= 100 ? '#10B981' : '#8A47EB',
                      borderRightColor: 'transparent',
                      borderBottomColor: 'transparent',
                    }}
                  />
                  <Text className="text-sm font-bold text-gray-700">
                    {Math.round(dailyNutrition.progress.calories_percent)}%
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between bg-gray-50 rounded-lg p-4 mb-4">
                <View>
                  <Text className="text-sm text-gray-500">Protein</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {Math.round(dailyNutrition.nutrition.total_protein)}g
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Target: {Math.round(dailyNutrition.nutrition.target_protein)}g
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-gray-500">Carbs</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {Math.round(dailyNutrition.nutrition.total_carbs)}g
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Target: {Math.round(dailyNutrition.nutrition.target_carbs)}g
                  </Text>
                </View>
                <View>
                  <Text className="text-sm text-gray-500">Fat</Text>
                  <Text className="text-lg font-semibold text-gray-900">
                    {Math.round(dailyNutrition.nutrition.total_fat)}g
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Target: {Math.round(dailyNutrition.nutrition.target_fat)}g
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity 
                  className="flex-1 bg-[#8A47EB] rounded-lg py-3 items-center mr-2"
                  onPress={handleScanMeal}
                >
                  <Text className="text-white font-semibold">📸 Scan Food</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 border border-[#8A47EB] rounded-lg py-3 items-center ml-2"
                  onPress={() => navigation.navigate('ManualMealLog' as never)}
                >
                  <Text className="text-[#8A47EB] font-semibold">✍️ Log Manually</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

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
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">Today's Plan</Text>
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => navigation.navigate('MainTabs', { screen: 'Meals' })}
              >
                <Text className="text-sm text-[#8A47EB] mr-1">View All</Text>
                <MaterialCommunityIcons name="chevron-right" size={16} color="#8A47EB" />
              </TouchableOpacity>
            </View>

            {apiService.getTodaysMeals(mealPlan).map((meal, index) => (
              <View key={meal.meal_id} className="flex-row items-center py-3 border-b border-gray-100 last:border-b-0">
                <View className="w-10 h-10 bg-purple-50 rounded-lg items-center justify-center mr-3">
                  <MaterialCommunityIcons name="food" size={20} color="#8A47EB" />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{meal.meal_name}</Text>
                  <Text className="text-sm text-gray-500 capitalize">{meal.meal_type}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-gray-100 rounded-lg px-3 py-1"
                  onPress={() => navigation.navigate('MealPlanDetails', { mealId: meal.meal_id })}
                >
                  <Text className="text-gray-600">Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Weekly Progress */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</Text>
          
          <View className="flex-row justify-between mb-6">
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#10B981]">-2.1kg</Text>
              <Text className="text-sm text-gray-500">Weight Loss</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#8A47EB]">5/7</Text>
              <Text className="text-sm text-gray-500">Days on Track</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-[#FF6B6B]">85%</Text>
              <Text className="text-sm text-gray-500">Goal Progress</Text>
            </View>
          </View>
          
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-sm text-gray-600 mb-1">💡 AI Insight</Text>
            <Text className="text-sm text-gray-800">
              Great progress! You're consistently hitting your protein goals and staying within your calorie target.
            </Text>
          </View>
        </View>

        {/* AI Assistant */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">AI Nutrition Coach</Text>
            <MaterialCommunityIcons name="robot-happy" size={24} color="#4b5563" />
          </View>

          <TouchableOpacity 
            className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3"
            onPress={() => navigation.navigate('Chat')}
          >
            <Text className="text-gray-600 flex-1">What's a good post-workout snack?</Text>
            <Feather name="chevron-right" size={16} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center p-3 bg-gray-50 rounded-lg"
            onPress={() => navigation.navigate('Chat')}
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