import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type AllergySelectionScreenProps = NativeStackNavigationProp<RootStackParamList, 'AllergySelection'>;

const allergyOptions = [
  { key: 'milk', name: 'Dairy', icon: 'cup', description: 'Milk and dairy products', color: '#F59E0B' },
  { key: 'eggs', name: 'Eggs', icon: 'egg', description: 'All types of eggs', color: '#EF4444' },
  { key: 'nuts', name: 'Nuts', icon: 'peanut', description: 'Almonds, walnuts, etc.', color: '#8B5CF6' },
  { key: 'fish', name: 'Fish', icon: 'fish', description: 'All fish types', color: '#06B6D4' },
  { key: 'shellfish', name: 'Shellfish', icon: 'shrimp', description: 'Shrimp, crab, etc.', color: '#EC4899' },
  { key: 'wheat', name: 'Wheat', icon: 'grain', description: 'Wheat and derivatives', color: '#F97316' },
  { key: 'soy', name: 'Soy', icon: 'soy-sauce', description: 'Soy and soy products', color: '#84CC16' },
  { key: 'gluten', name: 'Gluten', icon: 'bread-slice', description: 'Wheat, barley, rye, etc.', color: '#DC2626' },
];

const AllergySelectionScreen: React.FC = () => {
  const navigation = useNavigation<AllergySelectionScreenProps>();
  const { formData, updateFormData } = useMealPlanForm();
  
  const [selectedAllergies, setSelectedAllergies] = useState<Set<string>>(() => {
    return new Set(formData.allergies);
  });

  const toggleAllergy = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAllergies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateFormData({
      allergies: Array.from(selectedAllergies).map(key => {
        const option = allergyOptions.find(opt => opt.key === key);
        return option?.name || '';
      }).filter(Boolean),
    });
    navigation.navigate('DietaryPreferences');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateFormData({ allergies: [] });
    navigation.navigate('DietaryPreferences');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-[#8A47EB] font-semibold text-lg">Skip</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Any Food Allergies? 🤧
          </Text>
          <Text className="text-gray-500 text-lg">
            We'll make sure to avoid these in your meal plan
          </Text>
        </Animated.View>

        {/* Progress Indicator */}
        <Animated.View 
          entering={FadeInRight.delay(200).springify()}
          className="px-6 py-4"
        >
          <View className="flex-row items-center mb-2">
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full" />
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full ml-2" />
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
          </View>
          <Text className="text-sm text-gray-500">Step 2 of 4</Text>
        </Animated.View>

        <View className="px-6 py-4">
          {/* Selected Allergies Summary */}
          {selectedAllergies.size > 0 && (
            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
              className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6"
            >
              <View className="flex-row items-center mb-2">
                <Icon name="alert-circle" size={20} color="#8A47EB" />
                <Text className="text-[#8A47EB] font-semibold ml-2">Selected Allergies</Text>
              </View>
              <Text className="text-gray-700">
                {Array.from(selectedAllergies).map(key => {
                  const option = allergyOptions.find(opt => opt.key === key);
                  return option?.name;
                }).join(', ')}
              </Text>
            </Animated.View>
          )}

          {/* Allergy Grid */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-4">Common Allergies</Text>
            <View className="flex-row flex-wrap justify-between">
              {allergyOptions.map((allergy, index) => (
                <Animated.View 
                  key={allergy.key}
                  entering={FadeInDown.delay(500 + index * 50).springify()}
                  className="w-[48%] mb-4"
                >
                  <TouchableOpacity
                    className={`p-4 rounded-xl border-2 ${
                      selectedAllergies.has(allergy.key)
                        ? 'bg-white border-[#8A47EB] shadow-lg'
                        : 'bg-white border-gray-200 shadow-sm'
                    }`}
                    onPress={() => toggleAllergy(allergy.key)}
                    style={{
                      shadowColor: selectedAllergies.has(allergy.key) ? '#8A47EB' : '#000',
                      shadowOpacity: selectedAllergies.has(allergy.key) ? 0.15 : 0.05,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 4,
                      elevation: selectedAllergies.has(allergy.key) ? 8 : 2,
                    }}
                  >
                    <View className="items-center">
                      <View 
                        className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${
                          selectedAllergies.has(allergy.key) ? 'bg-purple-50' : 'bg-gray-100'
                        }`}
                      >
                        <Icon 
                          name={allergy.icon as any}
                          size={24}
                          color={selectedAllergies.has(allergy.key) ? '#8A47EB' : '#6B7280'}
                        />
                      </View>
                      <Text className={`font-semibold text-center mb-1 ${
                        selectedAllergies.has(allergy.key) ? 'text-[#8A47EB]' : 'text-gray-900'
                      }`}>
                        {allergy.name}
                      </Text>
                      <Text className="text-xs text-gray-500 text-center">
                        {allergy.description}
                      </Text>
                      {selectedAllergies.has(allergy.key) && (
                        <View className="absolute top-2 right-2 w-6 h-6 bg-[#8A47EB] rounded-full items-center justify-center">
                          <Icon name="check" size={14} color="white" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <View className="flex-row items-center mb-2">
                <Icon name="information" size={20} color="#3B82F6" />
                <Text className="text-blue-900 font-semibold ml-2">Important Note</Text>
              </View>
              <Text className="text-blue-800 text-sm">
                Selected allergies will be excluded from your meal plan. If you have severe allergies, 
                please consult with a healthcare professional.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Button */}
      <Animated.View 
        entering={FadeInDown.delay(900).springify()}
        className="px-6 py-4 bg-white border-t border-gray-200"
      >
        <TouchableOpacity 
          className="bg-[#8A47EB] py-4 rounded-xl items-center shadow-lg"
          onPress={handleNext}
          style={{
            shadowColor: '#8A47EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-lg mr-2">Continue</Text>
            <Icon name="arrow-right" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AllergySelectionScreen;