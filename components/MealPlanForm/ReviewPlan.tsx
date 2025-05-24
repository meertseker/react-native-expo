import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { useUser } from '@clerk/clerk-expo';
import apiService, { UserFormData } from '../../services/api';

type ReviewPlanNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReviewPlan'>;

export default function ReviewPlan() {
  const navigation = useNavigation<ReviewPlanNavigationProp>();
  const { formData, resetForm } = useMealPlanForm();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to create a meal plan.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data for backend
      const backendData: UserFormData = {
        user: {
          name: formData.name,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          clerk_user_id: user.id,
        },
        form: {
          current_weight: parseFloat(formData.weight),
          target_weight: parseFloat(formData.weight), // Using current weight as target for now
          height: parseFloat(formData.height),
          activity_frequency: formData.activityLevel || 'moderate',
        },
        allergies: formData.allergies,
      };

      // Submit to backend
      const result = await apiService.saveUserMealPlanForm(backendData);
      
      if (result.success) {
        // Show success message
        Alert.alert(
          'Success',
          'Your meal plan has been created! You can now view it in the app.',
          [
            {
              text: 'View Meal Plan',
              onPress: () => {
                resetForm();
                navigation.navigate('MainTabs');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create meal plan. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert(
        'Error',
        'Something went wrong while creating your meal plan. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: handleSubmit,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSection = (title: string, data: Record<string, any>) => (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
      <View className="bg-white rounded-xl p-4 border border-gray-200">
        {Object.entries(data).map(([key, value]) => (
          <View key={key} className="flex-row justify-between py-2 border-b border-gray-100 last:border-0">
            <Text className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
            <Text className="text-gray-900 font-medium">
              {Array.isArray(value) ? value.join(', ') : value.toString()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
            Review Your Plan
          </Text>
          <Text className="text-gray-600">
            Please review your preferences before we create your personalized meal plan.
          </Text>
        </View>

        {/* Personal Info */}
        {formatSection('Personal Information', {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
        })}

        {/* Physical Data */}
        {formatSection('Physical Information', {
          weight: `${formData.weight} kg`,
          height: `${formData.height} cm`,
          activityLevel: formData.activityLevel,
        })}

        {/* Dietary Preferences */}
        {formatSection('Dietary Preferences', {
          dietaryType: formData.dietaryPreference,
          allergies: formData.allergies.length > 0 ? formData.allergies : ['None'],
        })}

        {/* Meal Schedule */}
        {formatSection('Meal Schedule', {
          frequency: `${formData.mealFrequency} meals per day`,
          cookingSkill: formData.cookingSkill,
          breakfast: formData.mealTiming.breakfast,
          lunch: formData.mealTiming.lunch,
          dinner: formData.mealTiming.dinner,
        })}

        {/* Confirmation Box */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <Text className="text-blue-800 font-medium mb-2">What happens next?</Text>
          <Text className="text-blue-700 text-sm">
            Our AI will analyze your preferences and create a personalized meal plan including:{'\n\n'}
            • Balanced daily meals{'\n'}
            • Grocery shopping list{'\n'}
            • Detailed recipes{'\n'}
            • Nutritional information
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-6 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="bg-[#8A47EB] py-4 rounded-xl"
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Create My Meal Plan
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 