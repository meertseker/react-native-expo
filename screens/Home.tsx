import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useMealPlan } from '../contexts/MealPlanContext';
import { LinearGradient } from 'expo-linear-gradient';
import apiService from '../services/api';
import Animated, { FadeInDown, FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const { mealPlan, loading } = useMealPlan();
  const [dayNumber, setDayNumber] = useState(12); // This could be calculated from user's start date
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNextMeal = () => {
    if (!mealPlan) return null;
    const todaysMeals = apiService.getTodaysMeals(mealPlan);
    const currentHour = currentTime.getHours();
    
    // Find next meal based on typical meal times
    for (const meal of todaysMeals) {
      const formatted = apiService.formatMealForDisplay(meal);
      // This would need proper time parsing from your meal data
      return {
        ...formatted,
        timeUntil: '2:30 PM' // This should be calculated
      };
    }
    return todaysMeals[0] ? apiService.formatMealForDisplay(todaysMeals[0]) : null;
  };

  const getTodaysCalories = () => {
    if (!mealPlan) return { consumed: 0, target: 2100 };
    // This would be calculated from logged meals
    return { consumed: 1847, target: 2100 };
  };

  const quickActions = [
    {
      icon: 'camera' as const,
      label: 'Scan Food',
      color: '#FF6B6B',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('MealScanner');
      },
    },
    {
      icon: 'basket' as const,
      label: 'Shop',
      color: '#45B7D1',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('UserMeals');
      },
    },
    {
      icon: 'robot' as const,
      label: 'Ask AI',
      color: '#8A47EB',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Chat');
      },
    },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
      </SafeAreaView>
    );
  }

  const nextMeal = getNextMeal();
  const calories = getTodaysCalories();
  const progressPercentage = (calories.consumed / calories.target) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Greeting */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                {getTimeBasedGreeting()}, {user?.firstName || 'there'}! 👋
              </Text>
              <Text className="text-gray-500 text-base">
                Day {dayNumber} of your transformation
              </Text>
            </View>
            <TouchableOpacity className="p-2 bg-white rounded-full shadow-sm">
              <Ionicons name="notifications-outline" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Today's Overview */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="px-6 py-4"
        >
          <Text className="text-lg font-semibold text-gray-900 mb-4">📊 TODAY'S OVERVIEW</Text>
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-2xl font-bold text-gray-900">
                  {calories.consumed.toLocaleString()}/{calories.target.toLocaleString()}
                </Text>
                <Text className="text-gray-500">Calories</Text>
              </View>
              <View className="w-16 h-16 rounded-full border-4 border-gray-200 items-center justify-center relative">
                <View 
                  className="absolute w-16 h-16 rounded-full border-4 border-[#8A47EB]"
                  style={{
                    transform: [{ rotate: `${(progressPercentage * 3.6)}deg` }],
                    borderColor: progressPercentage >= 100 ? '#10B981' : '#8A47EB',
                  }}
                />
                <Text className="text-xs font-bold text-gray-700">
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-sm text-gray-500">Protein</Text>
                <Text className="font-semibold">98/140g</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Carbs</Text>
                <Text className="font-semibold">180/200g</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Fat</Text>
                <Text className="font-semibold">65/70g</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Next Meal Section */}
        {nextMeal && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            className="px-6 py-4"
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4">🍽️ NEXT MEAL (in 2 hours)</Text>
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center mb-4">
                <View className="w-16 h-16 bg-purple-50 rounded-xl items-center justify-center mr-4">
                  <Icon name="food" size={32} color="#8A47EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">{nextMeal.name}</Text>
                  <Text className="text-gray-500">{nextMeal.macros}</Text>
                </View>
              </View>
              
              <View className="flex-row space-x-3">
                <TouchableOpacity 
                  className="flex-1 bg-[#8A47EB] rounded-lg py-3 items-center"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    // Navigate to recipe or cooking instructions
                  }}
                >
                  <Text className="text-white font-semibold">🍳 Start Cooking</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="flex-1 border border-[#8A47EB] rounded-lg py-3 items-center"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Navigate to meal swapping
                  }}
                >
                  <Text className="text-[#8A47EB] font-semibold">🔄 Swap Meal</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                className="mt-3 py-2 items-center"
                onPress={() => navigation.navigate('UserMeals')}
              >
                <Text className="text-gray-500">🛒 Missing ingredients? Add to Shopping List</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInRight.delay(400).springify()}
          className="px-6 py-4"
        >
          <Text className="text-lg font-semibold text-gray-900 mb-4">🎯 QUICK ACTIONS</Text>
          <View className="flex-row justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="items-center flex-1"
                onPress={action.onPress}
              >
                <View 
                  className="w-16 h-16 rounded-2xl items-center justify-center mb-2 shadow-sm"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon name={action.icon} size={28} color={action.color} />
                </View>
                <Text className="text-sm text-gray-600 font-medium">{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Progress Snapshot */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          className="px-6 py-4 mb-6"
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">📈 PROGRESS SNAPSHOT</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
              <Text className="text-[#8A47EB] font-medium">View All →</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-2xl font-bold text-[#10B981]">-2.3kg</Text>
                <Text className="text-sm text-gray-500">This Week</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-[#8A47EB]">7/7</Text>
                <Text className="text-sm text-gray-500">Days on Track</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-[#FF6B6B]">85%</Text>
                <Text className="text-sm text-gray-500">Goal Progress</Text>
              </View>
            </View>
            
            <View className="bg-gray-100 rounded-lg p-3">
              <Text className="text-sm text-gray-600 mb-1">💡 AI Insight</Text>
              <Text className="text-sm text-gray-800">
                Great progress! You're on track to reach your goal 2 weeks early.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Smart Suggestions */}
        {mealPlan && (
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            className="px-6 py-4 mb-20"
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4">💡 SMART SUGGESTIONS</Text>
            <View className="space-y-3">
              <TouchableOpacity className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex-row items-center">
                <Icon name="water" size={24} color="#3B82F6" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-blue-900">Stay Hydrated</Text>
                  <Text className="text-sm text-blue-700">You're 2 glasses behind your daily goal</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#3B82F6" />
              </TouchableOpacity>
              
              <TouchableOpacity className="bg-green-50 border border-green-200 rounded-lg p-4 flex-row items-center">
                <Icon name="dumbbell" size={24} color="#10B981" />
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-green-900">Workout Day</Text>
                  <Text className="text-sm text-green-700">Add 200 calories for today's training</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
