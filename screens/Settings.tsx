import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity 
    className="flex-row items-center p-4 border-b border-gray-100"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-purple-50 rounded-lg items-center justify-center mr-3">
      <Ionicons name={icon} size={20} color="#8A47EB" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 font-medium">{title}</Text>
      <Text className="text-gray-500 text-sm">{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="p-6 bg-white mb-6">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
          <View className="flex-row items-center mt-4">
            <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl text-purple-600 font-semibold">
                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-900">
                {user?.firstName || 'User'}
              </Text>
              <Text className="text-gray-500">
                {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
              </Text>
            </View>
          </View>
        </View>

        {/* Nutrition Settings */}
        <View className="bg-white mx-4 rounded-xl mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">Nutrition</Text>
          </View>
          <SettingsItem 
            icon="restaurant" 
            title="Dietary Preferences" 
            subtitle="Manage your dietary restrictions"
            onPress={() => navigation.navigate('DietaryPreferences' as never)}
          />
          <SettingsItem 
            icon="fitness" 
            title="Fitness Goals" 
            subtitle="Update your training objectives"
          />
          <SettingsItem 
            icon="calculator" 
            title="Calorie Settings" 
            subtitle="Adjust daily calorie targets"
          />
          <SettingsItem 
            icon="time" 
            title="Meal Timing" 
            subtitle="Set preferred meal times"
            onPress={() => navigation.navigate('MealTiming' as never)}
          />
        </View>

        {/* App Settings */}
        <View className="bg-white mx-4 rounded-xl mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">App Settings</Text>
          </View>
          <SettingsItem 
            icon="notifications" 
            title="Notifications" 
            subtitle="Meal reminders and updates"
          />
          <SettingsItem 
            icon="shield-checkmark" 
            title="Privacy" 
            subtitle="Data sharing preferences"
          />
          <SettingsItem 
            icon="language" 
            title="Language" 
            subtitle="English"
          />
          <SettingsItem 
            icon="moon" 
            title="Dark Mode" 
            subtitle="Coming soon"
          />
        </View>

        {/* Support */}
        <View className="bg-white mx-4 rounded-xl mb-6 overflow-hidden">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">Support</Text>
          </View>
          <SettingsItem 
            icon="help-circle" 
            title="Help Center" 
            subtitle="FAQs and guides"
          />
          <SettingsItem 
            icon="chatbubble-ellipses" 
            title="Contact Support" 
            subtitle="Get help from our team"
          />
          <SettingsItem 
            icon="star" 
            title="Rate App" 
            subtitle="Share your experience"
          />
          <SettingsItem 
            icon="document-text" 
            title="Terms & Privacy" 
            subtitle="Legal information"
          />
        </View>

        {/* Account Actions */}
        <View className="bg-white mx-4 rounded-xl mb-8 overflow-hidden">
          <TouchableOpacity 
            className="p-4 items-center"
            onPress={handleSignOut}
          >
            <Text className="text-red-600 font-semibold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-8">
          <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}