import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type FirstMealFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FirstMealForm'>;

export default function FirstMealForm() {
  const navigation = useNavigation<FirstMealFormNavigationProp>();
  const { formData, updateFormData } = useMealPlanForm();
  const [name, setName] = useState(formData.name);
  const [age, setAge] = useState(formData.age);
  const [weight, setWeight] = useState(formData.weight);
  const [height, setHeight] = useState(formData.height);
  const [gender, setGender] = useState(formData.gender);

  const handleNext = () => {
    if (!name || !age || !weight || !height || !gender) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateFormData({
      name: name.trim(),
      age,
      weight,
      height,
      gender,
    });

    navigation.navigate('AllergySelection');
  };

  const handleGenderSelect = (selectedGender: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGender(selectedGender);
  };

  const genderOptions = [
    { id: 'male', label: 'Male', icon: 'account', color: '#3B82F6' },
    { id: 'female', label: 'Female', icon: 'account-outline', color: '#EC4899' },
  ];

  const isFormValid = name && age && weight && height && gender;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="px-6 pt-6 pb-4"
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm mb-6"
          >
            <Icon name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Let's Get Started! 🎯
          </Text>
          <Text className="text-gray-500 text-lg">
            Tell us about yourself to create your personalized meal plan
          </Text>
        </Animated.View>

        {/* Progress Indicator */}
        <Animated.View 
          entering={FadeInRight.delay(200).springify()}
          className="px-6 py-4"
        >
          <View className="flex-row items-center mb-2">
            <View className="flex-1 bg-[#8A47EB] h-1 rounded-full" />
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
            <View className="flex-1 bg-gray-200 h-1 rounded-full ml-2" />
          </View>
          <Text className="text-sm text-gray-500">Step 1 of 4</Text>
        </Animated.View>

        {/* Form Fields */}
        <View className="px-6 py-4 space-y-6">
          {/* Name Field */}
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-3">What's your name?</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-lg shadow-sm"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              style={{
                borderWidth: 2,
                borderColor: name ? '#8A47EB' : '#E5E7EB',
              }}
            />
          </Animated.View>

          {/* Age Field */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-3">How old are you?</Text>
            <TextInput
              className="bg-white rounded-xl p-4 text-lg shadow-sm"
              placeholder="Enter your age"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              style={{
                borderWidth: 2,
                borderColor: age ? '#8A47EB' : '#E5E7EB',
              }}
            />
          </Animated.View>

          {/* Gender Selection */}
          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Gender</Text>
            <View className="flex-row space-x-4">
              {genderOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  className={`flex-1 bg-white rounded-xl p-4 shadow-sm border-2 ${
                    gender === option.id ? 'border-[#8A47EB]' : 'border-gray-200'
                  }`}
                  onPress={() => handleGenderSelect(option.id)}
                  style={{
                    shadowColor: gender === option.id ? '#8A47EB' : '#000',
                    shadowOpacity: gender === option.id ? 0.1 : 0.05,
                  }}
                >
                  <View className="items-center">
                    <View 
                      className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                        gender === option.id ? 'bg-purple-50' : 'bg-gray-100'
                      }`}
                    >
                      <Icon 
                        name={option.icon as any} 
                        size={24} 
                        color={gender === option.id ? '#8A47EB' : '#6B7280'} 
                      />
                    </View>
                    <Text className={`font-semibold ${
                      gender === option.id ? 'text-[#8A47EB]' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Weight and Height Row */}
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Text className="text-lg font-semibold text-gray-900 mb-3">Physical Stats</Text>
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Weight (kg)</Text>
                <TextInput
                  className="bg-white rounded-xl p-4 text-lg shadow-sm"
                  placeholder="70"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                  style={{
                    borderWidth: 2,
                    borderColor: weight ? '#8A47EB' : '#E5E7EB',
                  }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Height (cm)</Text>
                <TextInput
                  className="bg-white rounded-xl p-4 text-lg shadow-sm"
                  placeholder="175"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                  style={{
                    borderWidth: 2,
                    borderColor: height ? '#8A47EB' : '#E5E7EB',
                  }}
                />
              </View>
            </View>
          </Animated.View>

          {/* Info Card */}
          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Icon name="information" size={20} color="#3B82F6" />
                <Text className="text-blue-900 font-semibold ml-2">Why we need this info</Text>
              </View>
              <Text className="text-blue-800 text-sm">
                This information helps us calculate your daily caloric needs and create a meal plan that's perfectly tailored to your body and goals.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Bottom Button */}
      <Animated.View 
        entering={FadeInDown.delay(800).springify()}
        className="px-6 py-4 bg-white border-t border-gray-200"
      >
        <TouchableOpacity
          className={`py-4 rounded-xl items-center ${
            isFormValid ? 'bg-[#8A47EB]' : 'bg-gray-300'
          }`}
          onPress={handleNext}
          disabled={!isFormValid}
          style={{
            shadowColor: isFormValid ? '#8A47EB' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isFormValid ? 0.3 : 0.1,
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
}