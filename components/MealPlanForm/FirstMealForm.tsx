import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';

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

    updateFormData({
      name: name.trim(),
      age,
      weight,
      height,
      gender,
    });

    navigation.navigate('AllergySelection');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="mt-6 mb-8">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Let's Get Started
          </Text>
          <Text className="text-gray-600">
            First, we need some basic information to create your personalized meal plan.
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-6">
          {/* Name */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-xl text-gray-900"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Age */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Age</Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-xl text-gray-900"
              placeholder="Enter your age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
          </View>

          {/* Gender Selection */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Gender</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl ${
                  gender === 'male' ? 'bg-purple-100 border-purple-500' : 'bg-gray-50 border-gray-200'
                } border`}
                onPress={() => setGender('male')}
              >
                <Text className={`text-center ${
                  gender === 'male' ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl ${
                  gender === 'female' ? 'bg-purple-100 border-purple-500' : 'bg-gray-50 border-gray-200'
                } border`}
                onPress={() => setGender('female')}
              >
                <Text className={`text-center ${
                  gender === 'female' ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weight */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Weight (kg)</Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-xl text-gray-900"
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          {/* Height */}
          <View>
            <Text className="text-gray-700 font-medium mb-2">Height (cm)</Text>
            <TextInput
              className="bg-gray-50 p-4 rounded-xl text-gray-900"
              placeholder="Enter your height"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        {/* Tips */}
        <View className="bg-blue-50 p-4 rounded-xl my-8">
          <Text className="text-blue-800 font-medium mb-2">Why we need this info?</Text>
          <Text className="text-blue-700 text-sm">
            This information helps us calculate your daily caloric needs and create a meal plan that's perfectly tailored to your body and goals.
          </Text>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className="p-6 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#8A47EB] py-4 rounded-xl"
          onPress={handleNext}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}