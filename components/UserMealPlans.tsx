import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService, { MealPlan } from '../services/api';
import { useMealPlan } from '../contexts/MealPlanContext';

type MealPlansScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserMeals'>;

const MealPlansScreen: React.FC = () => {
  const navigation = useNavigation<MealPlansScreenNavigationProp>();
  const { mealPlan, loading, refetch } = useMealPlan();

  const handleMealPlanPress = () => {
    if (mealPlan) {
      navigation.navigate('MealPlanDetails');
    }
  };

  const handleGroceryPress = () => {
    navigation.navigate('MainTabs');
  };

  const calculateProgress = () => {
    if (!mealPlan) return 0;
    
    const createdDate = new Date(mealPlan.meal_plan.created_at);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    const totalDays = 7;
    
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  };

  const getTimeAgo = () => {
    if (!mealPlan) return '';
    
    const createdDate = new Date(mealPlan.meal_plan.created_at);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return '1 day ago';
    if (daysDiff < 7) return `${daysDiff} days ago`;
    const weeksDiff = Math.floor(daysDiff / 7);
    if (weeksDiff === 1) return '1 week ago';
    return `${weeksDiff} weeks ago`;
  };

  const getTotalCalories = () => {
    if (!mealPlan) return 0;
    
    let totalCalories = 0;
    mealPlan.meal_plan.days.forEach(day => {
      totalCalories += apiService.calculateDailyCalories(mealPlan, day.day);
    });
    
    return Math.round(totalCalories / mealPlan.meal_plan.days.length);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
        <Text className="mt-4 text-gray-600">Loading your meal plans...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">My Meal Plans</Text>
          <TouchableOpacity className="p-2" onPress={refetch}>
            <Ionicons name="refresh" size={24} color="#8A47EB" />
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        {mealPlan && (
          <View className="bg-purple-50 rounded-xl p-4 mb-6">
            <Text className="text-purple-800 font-semibold text-lg mb-2">Current Plan Statistics</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">{mealPlan.meal_plan.days.length}</Text>
                <Text className="text-purple-500 text-xs">Days</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">{getTotalCalories()}</Text>
                <Text className="text-purple-500 text-xs">Avg. Calories</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">{mealPlan.grocery_list.length}</Text>
                <Text className="text-purple-500 text-xs">Ingredients</Text>
              </View>
            </View>
          </View>
        )}

        {/* Meal Plans List */}
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {mealPlan ? (
            <MealPlanCard 
              mealPlan={mealPlan}
              progress={calculateProgress()}
              lastUpdated={getTimeAgo()}
              onPress={handleMealPlanPress}
            />
          ) : (
            <View className="items-center justify-center py-20">
              <MaterialCommunityIcons name="food-off" size={80} color="#ccc" />
              <Text className="text-xl text-gray-500 mt-4 font-semibold">No Meal Plans Yet</Text>
              <Text className="text-gray-400 text-center mt-2 px-8">
                Create your first personalized meal plan to start your nutrition journey
              </Text>
              <TouchableOpacity 
                className="bg-[#8A47EB] px-6 py-3 rounded-lg mt-6"
                onPress={() => navigation.navigate('FirstMealForm')}
              >
                <Text className="text-white font-semibold">Create Your First Plan</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        {/* Action Buttons */}
        <View className="flex-row space-x-3 py-4">
          <TouchableOpacity 
            className="bg-[#8A47EB] flex-1 py-4 rounded-xl flex-row justify-center items-center"
            onPress={() => navigation.navigate('FirstMealForm')}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">New Plan</Text>
          </TouchableOpacity>
          
          {mealPlan && (
            <TouchableOpacity 
              className="bg-gray-100 flex-1 py-4 rounded-xl flex-row justify-center items-center"
              onPress={handleGroceryPress}
            >
              <Ionicons name="basket-outline" size={20} color="#374151" />
              <Text className="text-gray-700 font-bold text-lg ml-2">Grocery</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

interface MealPlanCardProps {
  mealPlan: MealPlan;
  progress: number;
  lastUpdated: string;
  onPress: () => void;
}

const MealPlanCard = ({ mealPlan, progress, lastUpdated, onPress }: MealPlanCardProps) => {
  const totalMeals = mealPlan.meal_plan.days.reduce((total: number, day) => total + day.meals.length, 0);
  const avgCalories = apiService.calculateDailyCalories(mealPlan, 1);

  return (
    <TouchableOpacity 
      className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm"
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 mb-1">AI Generated Meal Plan</Text>
            <Text className="text-gray-500 text-sm">7-day personalized nutrition plan</Text>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-medium text-xs">Active</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between mb-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="calendar-range" size={16} color="#8A47EB" />
            <Text className="text-sm text-gray-600 ml-1">7 days</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="fire" size={16} color="#FF6B6B" />
            <Text className="text-sm text-gray-600 ml-1">{avgCalories} cal/day</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="food" size={16} color="#10b981" />
            <Text className="text-sm text-gray-600 ml-1">{totalMeals} meals</Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View className="bg-gray-100 h-2 rounded-full overflow-hidden">
          <View 
            className="bg-[#8A47EB] h-full rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-gray-500 text-sm mt-2">Last updated {lastUpdated}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealPlansScreen;