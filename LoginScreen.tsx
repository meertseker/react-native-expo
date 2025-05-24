import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignIn, useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Social Auth Hooks
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  // Form Validation
  const validateForm = () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  // Email & Password Sign In
  const handleEmailSignIn = async () => {
    if (!isLoaded || !signIn) return;
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password: password,
      });

      if (completeSignIn?.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Social Auth Handlers
  const handleSocialAuth = async (strategy: 'google' | 'apple') => {
    const authFlow = strategy === 'google' ? googleAuth : appleAuth;
    
    try {
      const { createdSessionId, setActive } = await authFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 p-6 justify-center -mt-10">
      {/* Header */}
      <View className="mb-12">
        <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
        <Text className="text-gray-500 mt-2">Sign in to your account</Text>
      </View>

      {/* Email/Password Form */}
      <View className="space-y-4">
        <TextInput
          className="bg-white p-4 rounded-lg border border-gray-200"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <View className="flex-row items-center bg-white rounded-lg border border-gray-200">
          <TextInput
            className="flex-1 p-4"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="px-4"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="items-end mt-2"
          onPress={handleForgotPassword}
        >
          <Text className="text-blue-500">Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center mt-6"
          onPress={handleEmailSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Social Buttons */}
      <View className="space-y-4 mb-8 gap-2">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-500 p-4 rounded-lg"
          onPress={() => handleSocialAuth('google')}
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-white font-medium ml-2">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-black p-4 rounded-lg"
          onPress={() => handleSocialAuth('apple')}
        >
          <Ionicons name="logo-apple" size={20} color="white" />
          <Text className="text-white font-medium ml-2">Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Link */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text className="text-blue-500 font-medium">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
