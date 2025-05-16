import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

export default function Progress() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Hi, Mert</Text>
            <Text className="text-sm text-gray-500">MMA Training Plan</Text>
          </View>
          <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
            <Feather name="settings" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Weekly Progress</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-blue-600 mr-1">Details</Text>
              <Feather name="chevron-right" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <ProgressCircle percentage={65} label="Protein" color="#3b82f6" />
            <ProgressCircle percentage={85} label="Carbs" color="#8b5cf6" />
            <ProgressCircle percentage={45} label="Fat" color="#f59e0b" />
          </View>

          <View className="bg-blue-50 p-3 rounded-lg">
            <View className="flex-row items-center">
              <Ionicons name="barbell" size={16} color="#2563eb" />
              <Text className="text-sm text-blue-800 ml-2">
                On track to lose 0.6kg fat this week
              </Text>
            </View>
          </View>
        </View>

        {/* Meal Plan Preview */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Today's Meals (5 meals)</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-blue-600 mr-1">Adjust</Text>
              <Feather name="edit-3" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <MealPlanCard 
            time="7:30 AM" 
            name="High-Protein Breakfast" 
            macros="42P • 38C • 12F" 
            calories={320}
          />
          <MealPlanCard 
            time="10:30 AM" 
            name="Pre-Workout Snack" 
            macros="25P • 42C • 8F" 
            calories={280}
          />
          
          <TouchableOpacity className="flex-row justify-center items-center mt-4">
            <Text className="text-blue-600 text-sm">View Full Meal Plan</Text>
            <Feather name="chevron-down" size={16} color="#2563eb" className="ml-2" />
          </TouchableOpacity>
        </View>

        {/* Smart Grocery List */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Grocery List</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-blue-600 mr-1">Export</Text>
              <MaterialCommunityIcons name="export" size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>

          <GroceryListItem name="Chicken Breast" quantity="1.4kg" />
          <GroceryListItem name="Asparagus" quantity="420g" swapable />
          <GroceryListItem name="Oats" quantity="800g" />

          <TouchableOpacity className="flex-row items-center mt-4 bg-green-100 p-3 rounded-lg">
            <FontAwesome name="camera" size={16} color="#16a34a" />
            <Text className="text-green-800 text-sm ml-2">Scan to Add Items</Text>
          </TouchableOpacity>
        </View>

        {/* AI Assistant */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">AI Nutrition Coach</Text>
            <MaterialCommunityIcons name="robot-happy" size={24} color="#4b5563" />
          </View>

          <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-3">
            <Text className="text-gray-600 flex-1">What's a good post-MMA workout snack?</Text>
            <Feather name="chevron-right" size={16} color="#4b5563" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center p-3 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 flex-1">Suggest alternatives for salmon</Text>
            <Feather name="chevron-right" size={16} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg">
        <MaterialCommunityIcons name="food-apple" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function ProgressCircle({ percentage, label, color }: any) {
  return (
    <View className="items-center">
      <View className="w-16 h-16 rounded-full justify-center items-center border-4 border-gray-100">
        <Text style={{ color }} className="text-lg font-bold">{percentage}%</Text>
      </View>
      <Text className="text-sm text-gray-600 mt-2">{label}</Text>
    </View>
  );
}

function MealPlanCard({ time, name, macros, calories }: any) {
  return (
    <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-12 h-12 bg-gray-100 rounded-lg mr-4" />
      <View className="flex-1">
        <Text className="text-gray-500 text-sm">{time}</Text>
        <Text className="font-medium text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-500">{macros} • {calories} cal</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#4b5563" />
    </TouchableOpacity>
  );
}

function GroceryListItem({ name, quantity, swapable }: any) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100">
      <View className="w-6 h-6 bg-gray-100 rounded-sm mr-4" />
      <View className="flex-1">
        <Text className="font-medium text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-500">{quantity}</Text>
      </View>
      {swapable && (
        <TouchableOpacity className="p-2 bg-orange-100 rounded-lg">
          <Text className="text-orange-800 text-sm">Swap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}