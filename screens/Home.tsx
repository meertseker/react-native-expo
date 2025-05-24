import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService from '../services/api';
import { useMealPlan } from '../contexts/MealPlanContext';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useUser();
  const { mealPlan, loading } = useMealPlan();
  const [calorieGoal] = useState(2100); // This could be fetched from user data

  const getTodaysCalories = () => {
    if (!mealPlan) return 0;
    const today = new Date().getDay() || 7;
    return apiService.calculateDailyCalories(mealPlan, today);
  };

  const handleCreateNewPlan = () => {
    navigation.navigate('FirstMealForm');
  };

  const handleViewCurrentPlan = () => {
    if (mealPlan) {
      navigation.navigate('UserMeals');
    } else {
      Alert.alert('No Meal Plan', 'Please create a meal plan first.', [
        { text: 'Create Now', onPress: handleCreateNewPlan },
        { text: 'Cancel', style: 'cancel' }
      ]);
    }
  };

  const handleChatWithAI = () => {
    navigation.navigate('Chat');
  };

  const handleGroceryList = () => {
    navigation.navigate('UserMeals'); // This could navigate to a specific grocery screen
  };

  // Get today's meals
  const todaysMeals = mealPlan ? apiService.getTodaysMeals(mealPlan) : [];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
        <Text className="mt-4 text-gray-600">Loading your meal plan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Welcome Back, {user?.firstName || 'User'}
            </Text>
            <Text className="text-sm text-gray-500">
              {mealPlan ? 'Your Nutrition Plan is Active' : 'Ready to start your nutrition journey?'}
            </Text>
          </View>
          <TouchableOpacity className="p-2 bg-white rounded-full shadow-sm">
            <Ionicons name="notifications-outline" size={24} color="#4b5563" />
          </TouchableOpacity> 
        </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between mb-6">
          <StatCard 
            icon="fire" 
            title="Calories" 
            value={`${getTodaysCalories()}/${calorieGoal}`} 
            color="#f59e0b" 
          />
          <StatCard 
            icon="water" 
            title="Hydration" 
            value="2.1L" 
            color="#3b82f6" 
          />
          <StatCard 
            icon="speedometer" 
            title="Progress" 
            value={mealPlan ? "82%" : "0%"} 
            color="#10b981" 
          />
        </View>

        {/* Main Actions */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity 
            className="bg-[#8A47EB] p-4 flex-1 mr-3 rounded-xl items-center"
            onPress={handleCreateNewPlan}
          >
            <Text className="text-white font-semibold text-lg">
              {mealPlan ? 'Create New Plan' : 'Get Started'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white p-4 flex-1 ml-3 rounded-xl items-center shadow-sm"
            onPress={handleViewCurrentPlan}
          >
            <Text className="text-[#8A47EB] font-semibold text-lg">
              {mealPlan ? 'Current Plan' : 'View Plans'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Meal Plan */}
        <SectionHeader 
          title="Today's Nutrition Plan" 
          action="View All" 
          icon="food-apple"
          onActionPress={() => navigation.navigate('UserMeals')}
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          {todaysMeals.length > 0 ? (
            todaysMeals.slice(0, 3).map((meal, index) => {
              const formatted = apiService.formatMealForDisplay(meal);
              return (
                <MealItem 
                  key={meal.meal_id || index}
                  time={formatted.time}
                  name={formatted.name}
                  macros={formatted.macros}
                />
              );
            })
          ) : (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-center">
                {mealPlan ? 'No meals scheduled for today' : 'Create a meal plan to see your daily nutrition'}
              </Text>
            </View>
          )}
          <TouchableOpacity className="items-center mt-3" onPress={() => navigation.navigate('FirstMealForm')}>
            <Text className="text-[#8A47EB] font-medium">Add Custom Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Grocery List */}
        <SectionHeader
          title="Grocery List" 
          action="Export" 
          icon="cart"
          onActionPress={handleGroceryList}
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          {mealPlan && mealPlan.grocery_list.length > 0 ? (
            mealPlan.grocery_list.slice(0, 3).map((item, index) => (
              <GroceryItem 
                key={item.grocery_id || index}
                name={item.name}
                quantity={`${item.quantity}${item.unit}`}
                swapable={index === 1}
              />
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-gray-500 text-center">
                Create a meal plan to generate your grocery list
              </Text>
            </View>
          )}
          <TouchableOpacity className="flex-row items-center mt-3">
            <FontAwesome5 name="camera" size={16} color="#8A47EB" />
            <Text className="text-[#8A47EB] font-medium ml-2">Scan to Add Items</Text>
          </TouchableOpacity>
        </View>

        {/* AI Coaching Section */}
        <SectionHeader 
          title="AI Nutrition Coach" 
          action="Chat" 
          icon="robot"
          onActionPress={handleChatWithAI}
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <AICoachButton 
            title="Optimize Restaurant Order" 
            subtitle="Get AI recommendations for dining out"
            onPress={handleChatWithAI}
          />
          <AICoachButton 
            title="Quick Meal Prep Ideas" 
            subtitle="5-ingredient recipes from AI"
            onPress={handleChatWithAI}
          />
          <AICoachButton 
            title="Supplement Advice" 
            subtitle="Personalized recommendations"
            onPress={handleChatWithAI}
          />
        </View>

        {/* Progress Tracking */}
        <SectionHeader 
          title="Weekly Progress" 
          action="Details" 
          icon="chart-areaspline"
          onActionPress={() => navigation.navigate('Progress' as any)}
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <ProgressCircle percentage={mealPlan ? 78 : 0} label="Muscle Gain" color="#8A47EB" />
            <ProgressCircle percentage={mealPlan ? 65 : 0} label="Fat Loss" color="#10b981" />
            <ProgressCircle percentage={mealPlan ? 92 : 0} label="Recovery" color="#3b82f6" />
          </View>
          <Text className="text-center text-gray-600 text-sm">
            {mealPlan 
              ? 'Projected weekly result: 0.6kg muscle gain • 0.4kg fat loss'
              : 'Start tracking with a meal plan'
            }
          </Text>
        </View>
      </ScrollView>

      {/* Floating AI Assistant */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-[#8A47EB] p-4 rounded-full shadow-lg"
        onPress={handleChatWithAI}
      >
        <MaterialCommunityIcons name="robot" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Reusable Components
const SectionHeader = ({ title, action, icon, onActionPress }: any) => (
  <View className="flex-row justify-between items-center mb-4">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name={icon} size={20} color="#4b5563" />
      <Text className="text-lg font-semibold text-gray-900 ml-2">{title}</Text>
    </View>
    <TouchableOpacity className="flex-row items-center" onPress={onActionPress}>
      <Text className="text-[#8A47EB] font-medium mr-2">{action}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8A47EB" />
    </TouchableOpacity>
  </View>
);

const MealItem = ({ time, name, macros }: any) => (
  <TouchableOpacity className="py-3 border-b border-gray-100 last:border-0">
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-gray-500 text-sm">{time}</Text>
        <Text className="font-medium text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-500">{macros}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#4b5563" />
    </View>
  </TouchableOpacity>
);

const GroceryItem = ({ name, quantity, swapable }: any) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <View>
      <Text className="font-medium text-gray-900">{name}</Text>
      <Text className="text-sm text-gray-500">{quantity}</Text>
    </View>
    {swapable ? (
      <TouchableOpacity className="flex-row items-center bg-[#F6F0FF] px-3 py-1 rounded-full">
        <Text className="text-[#8A47EB] text-sm mr-2">Swap</Text>
        <MaterialCommunityIcons name="swap-horizontal" size={16} color="#8A47EB" />
      </TouchableOpacity>
    ) : (
      <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
    )}
  </View>
);

const AICoachButton = ({ title, subtitle, onPress }: any) => (
  <TouchableOpacity className="py-3 border-b border-gray-100 last:border-0" onPress={onPress}>
    <View>
      <Text className="font-medium text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const ProgressCircle = ({ percentage, label, color }: any) => (
  <View className="items-center">
    <View className="w-16 h-16 rounded-full border-4 border-gray-100 items-center justify-center">
      <Text style={{ color }} className="font-bold text-lg">{percentage}%</Text>
    </View>
    <Text className="text-sm text-gray-600 mt-2">{label}</Text>
  </View>
);

const StatCard = ({ icon, title, value, color }: any) => (
  <View className="bg-white p-4 rounded-xl flex-1 mx-1 shadow-sm">
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text className="text-sm text-gray-500 mt-2">{title}</Text>
    <Text className="text-lg font-semibold text-gray-900">{value}</Text>
  </View>
);

export default HomeScreen;
