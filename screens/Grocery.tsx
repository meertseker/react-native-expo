import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService from '../services/api';
import { useMealPlan } from '../contexts/MealPlanContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Grocery = () => {
  const { user } = useUser();
  const { mealPlan, loading } = useMealPlan();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItemCheck = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearAllChecked = () => {
    setCheckedItems(new Set());
  };

  const getCheckedCount = () => {
    return checkedItems.size;
  };

  const getTotalItems = () => {
    return mealPlan?.grocery_list.length || 0;
  };

  const groupItemsByCategory = () => {
    if (!mealPlan) return {};
    
    const categories: { [key: string]: any[] } = {
      'Protein': [],
      'Vegetables': [],
      'Fruits': [],
      'Grains': [],
      'Dairy': [],
      'Other': []
    };

    mealPlan.grocery_list.forEach(item => {
      // Simple categorization based on item name
      const name = item.name.toLowerCase();
      if (name.includes('chicken') || name.includes('beef') || name.includes('fish') || 
          name.includes('egg') || name.includes('meat') || name.includes('protein')) {
        categories['Protein'].push(item);
      } else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
                 name.includes('butter') || name.includes('dairy')) {
        categories['Dairy'].push(item);
      } else if (name.includes('rice') || name.includes('bread') || name.includes('pasta') || 
                 name.includes('oat') || name.includes('cereal') || name.includes('flour')) {
        categories['Grains'].push(item);
      } else if (name.includes('apple') || name.includes('banana') || name.includes('orange') || 
                 name.includes('berry') || name.includes('fruit')) {
        categories['Fruits'].push(item);
      } else if (name.includes('spinach') || name.includes('broccoli') || name.includes('carrot') || 
                 name.includes('tomato') || name.includes('onion') || name.includes('vegetable')) {
        categories['Vegetables'].push(item);
      } else {
        categories['Other'].push(item);
      }
    });

    // Remove empty categories
    return Object.fromEntries(
      Object.entries(categories).filter(([_, items]) => items.length > 0)
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
        <Text className="mt-4 text-gray-600">Loading your grocery list...</Text>
      </SafeAreaView>
    );
  }

  if (!mealPlan || mealPlan.grocery_list.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">Grocery List</Text>
          <Text className="text-gray-500">Your shopping list will appear here</Text>
        </View>
        
        <View className="flex-1 justify-center items-center px-6">
          <MaterialCommunityIcons name="cart-outline" size={80} color="#9ca3af" />
          <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2">No Grocery List Yet</Text>
          <Text className="text-gray-500 text-center">
            Create a meal plan to automatically generate your shopping list with all the ingredients you need.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const groupedItems = groupItemsByCategory();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6 bg-white border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Grocery List</Text>
            <Text className="text-gray-500">
              {getCheckedCount()} of {getTotalItems()} items collected
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-gray-100 px-3 py-2 rounded-lg"
            onPress={clearAllChecked}
          >
            <Text className="text-gray-700 text-sm font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View className="mt-4">
          <View className="h-2 bg-gray-200 rounded-full">
            <View 
              className="h-2 bg-[#8A47EB] rounded-full"
              style={{ width: `${getTotalItems() > 0 ? (getCheckedCount() / getTotalItems()) * 100 : 0}%` }}
            />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} className="mb-6">
            {/* Category Header */}
            <View className="flex-row items-center mb-3">
              <MaterialCommunityIcons 
                name={getCategoryIcon(category)} 
                size={20} 
                color="#6b7280" 
              />
              <Text className="text-lg font-semibold text-gray-900 ml-2">{category}</Text>
              <Text className="text-sm text-gray-500 ml-2">({items.length})</Text>
            </View>

            {/* Category Items */}
            <View className="bg-white rounded-xl overflow-hidden">
              {items.map((item, index) => (
                <GroceryItem
                  key={item.grocery_id}
                  item={item}
                  isChecked={checkedItems.has(item.grocery_id)}
                  onToggle={() => toggleItemCheck(item.grocery_id)}
                  isLast={index === items.length - 1}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Shopping Tips */}
        <View className="bg-blue-50 p-4 rounded-xl mt-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb" size={20} color="#3b82f6" />
            <Text className="font-semibold text-blue-800 ml-2">Shopping Tips</Text>
          </View>
          <Text className="text-blue-600 text-sm mb-1">• Buy organic produce when possible</Text>
          <Text className="text-blue-600 text-sm mb-1">• Check expiration dates for dairy products</Text>
          <Text className="text-blue-600 text-sm">• Consider buying in bulk for non-perishables</Text>
        </View>

        {/* Extra padding for bottom navigation */}
        <View className="h-32" />
      </ScrollView>

      {/* Action Buttons - Now floating above navigation bar */}
      <View className="absolute bottom-20 left-0 right-0 px-4 py-4">
        <View className="bg-white rounded-2xl shadow-xl p-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-gray-100 py-3 rounded-lg items-center">
              <View className="flex-row items-center">
                <Ionicons name="share-outline" size={20} color="#374151" />
                <Text className="ml-2 text-gray-700 font-medium">Share List</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-[#8A47EB] py-3 rounded-lg items-center"
              onPress={() => {/* Implement refresh logic */}}
            >
              <View className="flex-row items-center">
                <Ionicons name="refresh" size={20} color="white" />
                <Text className="ml-2 text-white font-medium">Refresh List</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Progress Summary */}
          <View className="mt-4 flex-row justify-between items-center">
            <Text className="text-gray-500">
              {getCheckedCount()} of {getTotalItems()} items collected
            </Text>
            <TouchableOpacity onPress={clearAllChecked}>
              <Text className="text-[#8A47EB] font-medium">Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Protein': return 'food-drumstick';
    case 'Vegetables': return 'carrot';
    case 'Fruits': return 'food-apple';
    case 'Grains': return 'bread-slice';
    case 'Dairy': return 'cow';
    case 'Other': return 'food';
    default: return 'food';
  }
};

// Grocery Item Component
const GroceryItem = ({ item, isChecked, onToggle, isLast }: any) => (
  <TouchableOpacity 
    className={`flex-row items-center p-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
    onPress={onToggle}
  >
    <TouchableOpacity 
      className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
        isChecked ? 'bg-[#8A47EB] border-[#8A47EB]' : 'border-gray-300'
      }`}
      onPress={onToggle}
    >
      {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
    </TouchableOpacity>
    
    <View className="flex-1">
      <Text className={`font-medium ${isChecked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
        {item.name}
      </Text>
      <Text className="text-sm text-gray-500">
        {item.quantity} {item.unit}
      </Text>
    </View>
    
    <TouchableOpacity className="p-2">
      <Ionicons name="add-circle-outline" size={20} color="#8A47EB" />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default Grocery;
