import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useMealPlan } from '../contexts/MealPlanContext';
import apiService from '../services/api';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type MealPlanNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const MealPlanScreen: React.FC = () => {
  const navigation = useNavigation<MealPlanNavigationProp>();
  const { mealPlan, loading } = useMealPlan();
  const [selectedTab, setSelectedTab] = useState<'now' | 'today' | 'history'>('now');

  const tabs = [
    { id: 'now' as const, label: 'Now & Next', icon: 'clock-outline' },
    { id: 'today' as const, label: "Today's Plan", icon: 'calendar-today' },
    { id: 'history' as const, label: 'Meal History', icon: 'history' },
  ];

  const getNextMeal = () => {
    if (!mealPlan) return null;
    const todaysMeals = apiService.getTodaysMeals(mealPlan);
    return todaysMeals[0] ? apiService.formatMealForDisplay(todaysMeals[0]) : null;
  };

  const handleMealAction = (action: string, mealId?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    switch (action) {
      case 'cook':
        // Navigate to recipe/cooking instructions
        console.log('Start cooking:', mealId);
        break;
      case 'swap':
        // Navigate to meal swapping
        console.log('Swap meal:', mealId);
        break;
      case 'complete':
        // Mark meal as completed
        console.log('Mark complete:', mealId);
        break;
      case 'skip':
        // Skip meal
        console.log('Skip meal:', mealId);
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
        <Text className="text-gray-500 mt-4">Loading your meal plan...</Text>
      </SafeAreaView>
    );
  }

  if (!mealPlan) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 px-6 py-8 justify-center items-center">
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View className="items-center">
              <View className="w-24 h-24 bg-purple-50 rounded-full items-center justify-center mb-6">
                <Icon name="food-fork-drink" size={48} color="#8A47EB" />
              </View>
              
              <Text className="text-3xl font-bold text-gray-900 text-center mb-4">
                Ready to start eating smart?
              </Text>
              
              <Text className="text-gray-500 text-center mb-8 text-lg">
                Create your personalized meal plan in just 30 seconds
              </Text>
              
              <TouchableOpacity
                className="bg-[#8A47EB] rounded-xl py-4 px-8 items-center w-full max-w-sm"
                onPress={() => navigation.navigate('FirstMealForm')}
              >
                <Text className="text-white font-bold text-lg">
                  ✨ Create My Meal Plan
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="mt-4 py-2"
                onPress={() => navigation.navigate('UserMeals')}
              >
                <Text className="text-[#8A47EB] font-medium">
                  View existing plans →
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const nextMeal = getNextMeal();
  const todaysMeals = apiService.getTodaysMeals(mealPlan);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        className="px-6 pt-6 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              🍽️ What Should I Eat?
            </Text>
            <Text className="text-gray-500">
              Your personalized meal plan
            </Text>
          </View>
          <TouchableOpacity className="p-2 bg-white rounded-full shadow-sm">
            <Icon name="cog" size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tab Navigation */}
      <Animated.View 
        entering={FadeInRight.delay(200).springify()}
        className="px-6 py-4"
      >
        <View className="flex-row bg-white rounded-xl p-1 shadow-sm">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              className={`flex-1 py-3 px-4 rounded-lg items-center ${
                selectedTab === tab.id ? 'bg-[#8A47EB]' : ''
              }`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedTab(tab.id);
              }}
            >
              <Icon 
                name={tab.icon} 
                size={20} 
                color={selectedTab === tab.id ? 'white' : '#6B7280'} 
              />
              <Text 
                className={`text-xs font-medium mt-1 ${
                  selectedTab === tab.id ? 'text-white' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <ScrollView className="flex-1">
        {/* Now & Next Tab */}
        {selectedTab === 'now' && nextMeal && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            className="px-6 py-4"
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4">Next Meal (in 1.5 hours)</Text>
            
            <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center mb-6">
                <View className="w-20 h-20 bg-purple-50 rounded-xl items-center justify-center mr-4">
                  <Icon name="food" size={36} color="#8A47EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-900 mb-1">
                    {nextMeal.name}
                  </Text>
                  <Text className="text-gray-500 text-base">
                    {nextMeal.macros}
                  </Text>
                  <Text className="text-[#8A47EB] font-medium">
                    Prep time: 15 mins
                  </Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View className="space-y-3">
                <View className="flex-row space-x-3">
                  <TouchableOpacity 
                    className="flex-1 bg-[#8A47EB] rounded-lg py-3 items-center"
                    onPress={() => handleMealAction('cook', nextMeal.id)}
                  >
                    <Text className="text-white font-semibold">🍳 Start Cooking</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-1 border border-[#8A47EB] rounded-lg py-3 items-center"
                    onPress={() => handleMealAction('swap', nextMeal.id)}
                  >
                    <Text className="text-[#8A47EB] font-semibold">🔄 Swap Meal</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="flex-row space-x-3">
                  <TouchableOpacity 
                    className="flex-1 bg-green-50 border border-green-200 rounded-lg py-3 items-center"
                    onPress={() => handleMealAction('complete', nextMeal.id)}
                  >
                    <Text className="text-green-700 font-semibold">✅ Mark Eaten</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-3 items-center"
                    onPress={() => handleMealAction('skip', nextMeal.id)}
                  >
                    <Text className="text-gray-700 font-semibold">⏭️ Skip Meal</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                className="mt-4 py-2 items-center border-t border-gray-100"
                onPress={() => navigation.navigate('UserMeals')}
              >
                <Text className="text-gray-500">🛒 Missing ingredients? Add to Shopping List</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm"
                onPress={() => navigation.navigate('MealScanner')}
              >
                <Icon name="camera" size={24} color="#FF6B6B" />
                <Text className="font-medium text-gray-900 mt-2">Scan Food</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm"
                onPress={() => navigation.navigate('ManualMealLog')}
              >
                <Icon name="pencil" size={24} color="#10B981" />
                <Text className="font-medium text-gray-900 mt-2">Log Meal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm"
                onPress={() => navigation.navigate('Chat')}
              >
                <Icon name="robot" size={24} color="#8A47EB" />
                <Text className="font-medium text-gray-900 mt-2">Ask AI</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Today's Plan Tab */}
        {selectedTab === 'today' && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            className="px-6 py-4"
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4">Today's Full Plan</Text>
            
            <View className="space-y-4">
              {todaysMeals.map((meal, index) => {
                const formatted = apiService.formatMealForDisplay(meal);
                const isNext = index === 0; // Simplified logic
                
                return (
                  <View 
                    key={index} 
                    className={`bg-white rounded-xl p-4 shadow-sm ${
                      isNext ? 'border-2 border-[#8A47EB]' : ''
                    }`}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                          isNext ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                          <Icon name="food" size={20} color={isNext ? "#8A47EB" : "#6B7280"} />
                        </View>
                        <View>
                          <Text className="font-semibold text-gray-900">{formatted.name}</Text>
                          <Text className="text-sm text-gray-500">{formatted.time} • {formatted.macros}</Text>
                        </View>
                      </View>
                      
                      {isNext && (
                        <View className="bg-[#8A47EB] px-3 py-1 rounded-full">
                          <Text className="text-white text-xs font-bold">NEXT</Text>
                        </View>
                      )}
                    </View>
                    
                    {isNext && (
                      <View className="flex-row space-x-2">
                        <TouchableOpacity 
                          className="flex-1 bg-[#8A47EB] rounded-lg py-2 items-center"
                          onPress={() => handleMealAction('cook', formatted.id)}
                        >
                          <Text className="text-white font-medium text-sm">Cook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 border border-[#8A47EB] rounded-lg py-2 items-center"
                          onPress={() => handleMealAction('swap', formatted.id)}
                        >
                          <Text className="text-[#8A47EB] font-medium text-sm">Swap</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="flex-1 bg-green-50 border border-green-200 rounded-lg py-2 items-center"
                          onPress={() => handleMealAction('complete', formatted.id)}
                        >
                          <Text className="text-green-700 font-medium text-sm">Done</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Meal History Tab */}
        {selectedTab === 'history' && (
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            className="px-6 py-4"
          >
            <Text className="text-lg font-semibold text-gray-900 mb-4">Recent Meals</Text>
            
            <View className="bg-white rounded-xl p-6 shadow-sm">
              <View className="items-center">
                <Icon name="history" size={48} color="#8A47EB" />
                <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                  Meal History Coming Soon
                </Text>
                <Text className="text-gray-500 text-center mb-6">
                  Track your meal completion and see your nutrition journey
                </Text>
                
                <TouchableOpacity 
                  className="bg-[#8A47EB] rounded-lg py-3 px-6 items-center"
                  onPress={() => navigation.navigate('Progress')}
                >
                  <Text className="text-white font-semibold">View Progress Instead</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
        
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealPlanScreen;