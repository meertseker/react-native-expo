import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService from '../services/api';

export default function ManualMealLog() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('unknown');

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: 'coffee' },
    { key: 'lunch', label: 'Lunch', icon: 'food' },
    { key: 'dinner', label: 'Dinner', icon: 'food-turkey' },
    { key: 'snack', label: 'Snack', icon: 'food-apple' },
  ];

  const validateForm = () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return false;
    }
    if (!calories.trim() || isNaN(Number(calories))) {
      Alert.alert('Error', 'Please enter valid calories');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setLoading(true);
      await apiService.logMealManually({
        clerkUserId: user.id,
        mealName: mealName.trim(),
        calories: Number(calories),
        mealType: selectedMealType,
        protein: protein ? Number(protein) : undefined,
        carbs: carbs ? Number(carbs) : undefined,
        fat: fat ? Number(fat) : undefined,
      });

      Alert.alert(
        'Success',
        'Meal logged successfully!',
        [
          {
            text: 'View Progress',
            onPress: () => navigation.navigate('Progress' as never),
          },
          {
            text: 'Log Another',
            onPress: () => {
              setMealName('');
              setCalories('');
              setProtein('');
              setCarbs('');
              setFat('');
              setSelectedMealType('unknown');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error logging meal:', error);
      Alert.alert('Error', 'Failed to log meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Log Meal</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text className="text-[#8A47EB] font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Meal Type Selection */}
        <Text className="text-gray-600 font-medium mb-2">Meal Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              className={`mr-3 px-4 py-2 rounded-full border ${
                selectedMealType === type.key 
                  ? 'bg-[#8A47EB] border-[#8A47EB]' 
                  : 'bg-white border-gray-300'
              }`}
              onPress={() => setSelectedMealType(type.key)}
            >
              <Text 
                className={selectedMealType === type.key ? 'text-white' : 'text-gray-600'}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Meal Name */}
        <View className="mb-6">
          <Text className="text-gray-600 font-medium mb-2">Meal Name *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-900"
            placeholder="Enter meal name"
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        {/* Calories */}
        <View className="mb-6">
          <Text className="text-gray-600 font-medium mb-2">Calories *</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-gray-900"
            placeholder="Enter calories"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
        </View>

        {/* Macros */}
        <Text className="text-gray-600 font-medium mb-4">Macronutrients (Optional)</Text>
        <View className="flex-row space-x-4 mb-6">
          <View className="flex-1">
            <Text className="text-gray-600 text-sm mb-2">Protein (g)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-900"
              placeholder="0"
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-600 text-sm mb-2">Carbs (g)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-900"
              placeholder="0"
              keyboardType="numeric"
              value={carbs}
              onChangeText={setCarbs}
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-600 text-sm mb-2">Fat (g)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-900"
              placeholder="0"
              keyboardType="numeric"
              value={fat}
              onChangeText={setFat}
            />
          </View>
        </View>

        {/* Quick Tips */}
        <View className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text className="text-blue-800 font-medium mb-2">Quick Tips</Text>
          <Text className="text-blue-600 text-sm">
            • Required fields are marked with *{'\n'}
            • Enter at least calories for basic tracking{'\n'}
            • Add macros for detailed nutrition tracking{'\n'}
            • Use the camera icon to scan meals instead
          </Text>
        </View>
      </ScrollView>

      {loading && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 items-center">
            <ActivityIndicator size="large" color="#8A47EB" />
            <Text className="mt-4 text-gray-900 font-semibold">Saving meal...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
} 