import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService, { MealPlan } from '../services/api';

type MealPlanDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MealPlanDetails'>;

const MealPlanDetails: React.FC = () => {
  const navigation = useNavigation<MealPlanDetailsNavigationProp>();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealPlan();
  }, [user]);

  const loadMealPlan = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await apiService.getMealPlan(user.id);
      setMealPlan(data);
    } catch (error) {
      console.error('Failed to load meal plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!mealPlan) return 0;
    
    const createdDate = new Date(mealPlan.meal_plan.created_at);
    const today = new Date();
    const daysPassed = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
    const totalDays = 7;
    
    return Math.min(Math.round((daysPassed / totalDays) * 100), 100);
  };

  const getAverageCalories = () => {
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
        <Text className="mt-4 text-gray-600">Loading meal plan details...</Text>
      </SafeAreaView>
    );
  }

  if (!mealPlan) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <MaterialCommunityIcons name="food-off" size={80} color="#ccc" />
        <Text className="text-xl text-gray-500 mt-4 font-semibold">No Meal Plan Found</Text>
        <Text className="text-gray-400 text-center mt-2">
          You don't have an active meal plan yet. Create one to get started!
        </Text>
        <TouchableOpacity 
          className="bg-[#8A47EB] px-6 py-3 rounded-lg mt-6"
          onPress={() => navigation.navigate('FirstMealForm')}
        >
          <Text className="text-white font-semibold">Create Meal Plan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab mealPlan={mealPlan} />;
      case 'schedule':
        return <ScheduleTab mealPlan={mealPlan} />;
      case 'grocery':
        return <GroceryTab groceries={mealPlan.grocery_list} />;
      default:
        return <OverviewTab mealPlan={mealPlan} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="absolute top-6 left-6 z-10"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-center text-gray-900">Meal Plan Details</Text>
        </View>

        {/* Plan Hero Section */}
        <View className="px-6 mt-6">
          <View className="bg-gray-100 rounded-xl p-4">
            <Text className="text-2xl font-bold text-gray-900 mb-2">AI Generated Meal Plan</Text>
            <View className="flex-row justify-between mb-4">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="calendar-range" size={16} color="#8A47EB" />
                <Text className="text-sm text-gray-600 ml-1">7 days</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="fire" size={16} color="#FF6B6B" />
                <Text className="text-sm text-gray-600 ml-1">{getAverageCalories()} kcal/day</Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="food" size={16} color="#10b981" />
                <Text className="text-sm text-gray-600 ml-1">
                  {mealPlan.meal_plan.days.reduce((total, day) => total + day.meals.length, 0)} meals
                </Text>
              </View>
            </View>
            <ProgressBar progress={calculateProgress()} />
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around mt-6 border-b border-gray-200">
          {['overview', 'schedule', 'grocery'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`pb-3 ${activeTab === tab ? 'border-b-2 border-purple-600' : ''}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text className={`text-sm font-medium ${activeTab === tab ? 'text-purple-600' : 'text-gray-500'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View className="px-6 mt-4">
          {renderContent()}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row justify-between p-4 bg-white border-t border-gray-100">
        <TouchableOpacity 
          className="bg-gray-100 px-6 py-3 rounded-lg flex-1 mr-2"
          onPress={() => navigation.navigate('FirstMealForm')}
        >
          <Text className="text-center text-gray-900 font-medium">Create New Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-purple-600 px-6 py-3 rounded-lg flex-1 ml-2"
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text className="text-center text-white font-medium">Back to App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => (
  <View className="relative">
    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <View 
        className="h-full bg-green-500 rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </View>
    <Text className="text-xs text-gray-500 mt-1">Progress: {progress}%</Text>
  </View>
);

const OverviewTab = ({ mealPlan }: { mealPlan: MealPlan }) => (
  <View>
    <Text className="text-base text-gray-600 mb-4">
      Your personalized 7-day nutrition plan created by AI based on your preferences and goals.
    </Text>
    
    <Text className="text-lg font-bold text-gray-900 mb-3">Plan Statistics</Text>
    <View className="flex-row justify-between mb-4">
      <StatCard 
        icon="calendar-range" 
        value={mealPlan.meal_plan.days.length.toString()} 
        label="Days" 
      />
      <StatCard 
        icon="food" 
        value={mealPlan.meal_plan.days.reduce((total, day) => total + day.meals.length, 0).toString()} 
        label="Total Meals" 
      />
      <StatCard 
        icon="basket" 
        value={mealPlan.grocery_list.length.toString()} 
        label="Ingredients" 
      />
    </View>

    <Text className="text-lg font-bold text-gray-900 mb-3">Quick Overview</Text>
    <View className="bg-blue-50 p-4 rounded-lg mb-4">
      <Text className="text-blue-800 font-medium mb-2">Plan Details:</Text>
      <Text className="text-blue-700 text-sm">
        • Created on {new Date(mealPlan.meal_plan.created_at).toLocaleDateString()}{'\n'}
        • Covers {mealPlan.meal_plan.days.length} days of meals{'\n'}
        • Includes {mealPlan.grocery_list.length} unique ingredients{'\n'}
        • Tailored to your dietary preferences
      </Text>
    </View>
  </View>
);

const StatCard = ({ icon, value, label }: { icon: string; value: string; label: string }) => (
  <View className="items-center bg-gray-50 p-3 rounded-xl flex-1 mx-1">
    <MaterialCommunityIcons 
      name={icon as any} 
      size={24} 
      color="#8A47EB" 
      className="mb-1"
    />
    <Text className="font-bold text-gray-900">{value}</Text>
    <Text className="text-xs text-gray-500">{label}</Text>
  </View>
);

const ScheduleTab = ({ mealPlan }: { mealPlan: MealPlan }) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  return (
    <View>
      {mealPlan.meal_plan.days.map((dayPlan) => (
        <View key={dayPlan.day} className="mb-4 bg-gray-50 rounded-xl p-3">
          <Text className="font-bold text-gray-900 mb-2">
            Day {dayPlan.day} - {dayNames[dayPlan.day === 7 ? 0 : dayPlan.day]}
          </Text>
          {dayPlan.meals.map((meal, index) => (
            <MealCard key={meal.meal_id} meal={meal} />
          ))}
        </View>
      ))}
    </View>
  );
};

const MealCard = ({ meal }: { meal: any }) => (
  <View className="mb-3 bg-white p-3 rounded-lg">
    <View className="flex-row justify-between items-start mb-2">
      <Text className="font-medium text-gray-900">{meal.meal_name}</Text>
      <View className="bg-purple-100 px-2 py-1 rounded">
        <Text className="text-purple-700 text-xs font-medium">{meal.meal_type}</Text>
      </View>
    </View>
    <Text className="text-gray-600 text-sm mb-2">Ingredients:</Text>
    {meal.ingredients.slice(0, 3).map((ingredient: any, index: number) => (
      <Text key={ingredient.ingredient_id} className="text-gray-500 text-xs">
        • {ingredient.ingredient_name} ({ingredient.quantity} {ingredient.unit})
      </Text>
    ))}
    {meal.ingredients.length > 3 && (
      <Text className="text-gray-400 text-xs mt-1">
        +{meal.ingredients.length - 3} more ingredients
      </Text>
    )}
  </View>
);

const GroceryTab = ({ groceries }: { groceries: Array<{ grocery_id: string; name: string; quantity: number; unit: string }> }) => (
  <View>
    <Text className="text-lg font-bold text-gray-900 mb-3">
      Shopping List ({groceries.length} items)
    </Text>
    <View className="bg-gray-50 rounded-xl p-3">
      {groceries.map((item, index) => (
        <View key={item.grocery_id || index} className="flex-row items-center py-3 border-b border-gray-200 last:border-0">
          <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#8A47EB" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-900 font-medium">{item.name}</Text>
            <Text className="text-gray-500 text-sm">{item.quantity} {item.unit}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default MealPlanDetails;