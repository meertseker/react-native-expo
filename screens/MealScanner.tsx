import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  Modal, 
  ScrollView, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import apiService, { MealScanResult, FoodAnalysis } from '../services/api';

export default function MealScanner() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<MealScanResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('unknown');
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    // Request permissions on mount
    requestPermission();
  }, []);

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: 'coffee' },
    { key: 'lunch', label: 'Lunch', icon: 'food' },
    { key: 'dinner', label: 'Dinner', icon: 'food-turkey' },
    { key: 'snack', label: 'Snack', icon: 'food-apple' },
  ];

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo?.base64 && user?.id) {
        await analyzeMeal(photo.base64, photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      setAnalyzing(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant photo library access to scan meals.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64 && user?.id) {
        setAnalyzing(true);
        await analyzeMeal(result.assets[0].base64, result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const analyzeMeal = async (base64: string, imageUri: string) => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const result = await apiService.scanMeal(user.id, base64, selectedMealType);
      setScanResult(result);
      setShowCamera(false);
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing meal:', error);
      Alert.alert('Analysis Failed', 'Could not analyze the meal. Please try again or log manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveResult = () => {
    Alert.alert(
      'Meal Logged!',
      `Successfully logged ${scanResult?.nutrition_summary.calories} calories.`,
      [
        {
          text: 'View Progress',
          onPress: () => {
            setShowResults(false);
            navigation.navigate('Progress' as never);
          },
        },
        {
          text: 'Scan Another',
          onPress: () => {
            setShowResults(false);
            setScanResult(null);
          },
        },
      ]
    );
  };

  const renderAnalysisResults = () => {
    if (!scanResult) return null;

    const { analysis, nutrition_summary, daily_progress } = scanResult;

    return (
      <Modal
        visible={showResults}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowResults(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text className="text-lg font-bold">Meal Analysis</Text>
              <TouchableOpacity onPress={handleSaveResult}>
                <Text className="text-[#8A47EB] font-semibold">Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Meal Description */}
              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-2">
                  {analysis.meal_description}
                </Text>
                <Text className="text-gray-600">
                  {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
                </Text>
              </View>

              {/* Nutrition Summary */}
              <View className="bg-[#8A47EB] rounded-xl p-4 mb-4">
                <Text className="text-white font-bold text-lg mb-3">Nutrition Summary</Text>
                <View className="flex-row justify-between">
                  <NutritionCard 
                    label="Calories" 
                    value={nutrition_summary.calories.toString()} 
                    unit="kcal"
                    color="text-white"
                  />
                  <NutritionCard 
                    label="Protein" 
                    value={nutrition_summary.protein.toFixed(1)} 
                    unit="g"
                    color="text-white"
                  />
                  <NutritionCard 
                    label="Carbs" 
                    value={nutrition_summary.carbs.toFixed(1)} 
                    unit="g"
                    color="text-white"
                  />
                  <NutritionCard 
                    label="Fat" 
                    value={nutrition_summary.fat.toFixed(1)} 
                    unit="g"
                    color="text-white"
                  />
                </View>
              </View>

              {/* Detected Foods */}
              <View className="mb-4">
                <Text className="text-lg font-bold text-gray-900 mb-3">Detected Foods</Text>
                {analysis.foods.map((food, index) => (
                  <FoodItem key={index} food={food} />
                ))}
              </View>

              {/* Daily Progress */}
              {daily_progress && (
                <View className="bg-green-50 rounded-xl p-4 mb-4">
                  <Text className="text-green-800 font-bold text-lg mb-3">Today's Progress</Text>
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-green-600">
                        {daily_progress.total_calories}
                      </Text>
                      <Text className="text-green-500 text-xs">Total Calories</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-green-600">
                        {daily_progress.target_calories}
                      </Text>
                      <Text className="text-green-500 text-xs">Target</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-2xl font-bold text-green-600">
                        {daily_progress.calories_remaining}
                      </Text>
                      <Text className="text-green-500 text-xs">Remaining</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mt-4">
                    <View className="h-2 bg-green-200 rounded-full">
                      <View 
                        className="h-full bg-green-500 rounded-full"
                        style={{ 
                          width: `${Math.min((daily_progress.total_calories / daily_progress.target_calories) * 100, 100)}%` 
                        }}
                      />
                    </View>
                    <Text className="text-center text-green-600 text-xs mt-1">
                      {Math.round((daily_progress.total_calories / daily_progress.target_calories) * 100)}% of daily goal
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#8A47EB" />
        <Text className="mt-4 text-gray-600">Loading camera...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <MaterialCommunityIcons name="camera-off" size={80} color="#ccc" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">Camera Permission Required</Text>
        <Text className="text-gray-600 text-center mb-6">
          We need camera access to scan your meals and track nutrition automatically.
        </Text>
        <TouchableOpacity 
          className="bg-[#8A47EB] px-6 py-3 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center p-4 bg-black">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Scan Meal</Text>
        <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Meal Type Selection */}
      <View className="px-4 pb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mealTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedMealType === type.key ? 'bg-[#8A47EB]' : 'bg-gray-800'
              }`}
              onPress={() => setSelectedMealType(type.key)}
            >
              <Text className={`${selectedMealType === type.key ? 'text-white' : 'text-gray-400'}`}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Camera or Options */}
      {showCamera ? (
        <View className="flex-1">
          <CameraView 
            style={{ flex: 1 }} 
            facing={facing} 
            ref={cameraRef}
          >
            {/* Camera Overlay */}
            <View className="flex-1 justify-end items-center pb-8">
              <View className="flex-row items-center space-x-6">
                <TouchableOpacity 
                  className="w-16 h-16 bg-white bg-opacity-30 rounded-full justify-center items-center"
                  onPress={handlePickImage}
                >
                  <Ionicons name="images" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  className="w-20 h-20 bg-white rounded-full justify-center items-center"
                  onPress={handleTakePhoto}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <ActivityIndicator size="large" color="#8A47EB" />
                  ) : (
                    <View className="w-16 h-16 bg-[#8A47EB] rounded-full" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  className="w-16 h-16 bg-white bg-opacity-30 rounded-full justify-center items-center"
                  onPress={() => setShowCamera(false)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <MaterialCommunityIcons name="camera-plus" size={80} color="#8A47EB" />
          <Text className="text-white text-2xl font-bold mt-4 mb-2">Scan Your Meal</Text>
          <Text className="text-gray-500 text-center mb-6">
            Point your camera at food to get instant nutrition analysis and meal suggestions. We&apos;ll help you make healthier choices!
          </Text>

          <TouchableOpacity 
            className="bg-[#8A47EB] w-full py-4 rounded-xl mb-4"
            onPress={() => setShowCamera(true)}
          >
            <Text className="text-white text-center font-bold text-lg">Open Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-gray-800 w-full py-4 rounded-xl mb-4"
            onPress={handlePickImage}
          >
            <Text className="text-white text-center font-bold text-lg">Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="w-full py-4"
            onPress={() => navigation.navigate('ManualMealLog' as never)}
          >
            <Text className="text-gray-400 text-center">Log meal manually instead</Text>
          </TouchableOpacity>
        </View>
      )}

      {analyzing && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 items-center">
            <ActivityIndicator size="large" color="#8A47EB" />
            <Text className="mt-4 text-gray-900 font-semibold">Analyzing your meal...</Text>
            <Text className="text-gray-600 text-sm mt-1">This may take a few seconds</Text>
          </View>
        </View>
      )}

      {renderAnalysisResults()}
    </SafeAreaView>
  );
}

const NutritionCard = ({ label, value, unit, color }: any) => (
  <View className="items-center">
    <Text className={`text-xl font-bold ${color}`}>{value}</Text>
    <Text className={`text-xs ${color} opacity-80`}>{label}</Text>
    <Text className={`text-xs ${color} opacity-60`}>{unit}</Text>
  </View>
);

const FoodItem = ({ food }: { food: any }) => (
  <View className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
    <View className="flex-row justify-between items-start">
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{food.name}</Text>
        <Text className="text-gray-600 text-sm">
          {food.estimated_quantity} {food.unit} • {food.calories} cal
        </Text>
      </View>
      <View className="bg-green-100 px-2 py-1 rounded">
        <Text className="text-green-800 text-xs font-medium">
          {Math.round(food.confidence * 100)}% confident
        </Text>
      </View>
    </View>
  </View>
); 