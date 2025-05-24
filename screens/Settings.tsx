import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

  const SettingsItem = ({ icon, title, subtitle, onPress, showArrow = true }: any) => (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-4 bg-white border-b border-gray-100"
      onPress={onPress}
    >
      <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#6b7280" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        </View>

        {/* Profile Section */}
        <View className="bg-white mx-4 rounded-xl mb-6 overflow-hidden">
          <View className="p-4 bg-gradient-to-r from-purple-500 to-blue-500">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-white rounded-full items-center justify-center mr-4">
                <Text className="text-xl font-bold text-purple-500">
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-white">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </Text>
                <Text className="text-purple-100">
                  {user?.emailAddresses[0]?.emailAddress || 'No email'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="p-4 border-b border-gray-100">
            <Text className="text-purple-600 font-medium">Edit Profile</Text>
          </TouchableOpacity>
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
};

export default Settings;