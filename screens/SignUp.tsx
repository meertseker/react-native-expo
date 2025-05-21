import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
 
export default function CustomSignUp() {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Social Auth Hooks
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
 
  // Şifre gücünü hesapla
  useEffect(() => {
    let strength = 0;
    if (password.length > 0) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);
 
  
 
  // Form Validation
  const validateForm = () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return false;
    }
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to terms and privacy policy');
      return false;
    }
    return true;
  };
 
  // Email & Password Sign Up
  const handleEmailSignUp = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await signUp?.create({ emailAddress: email, password: password });
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
      Alert.alert('Success', 'Verification code sent to your email');
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
 
  // Email Verification
  const verifyEmail = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const completeSignUp = await signUp?.attemptEmailAddressVerification({ code });
      if (completeSignUp?.status === 'complete') {
        Alert.alert('Verified', 'Your account has been created!');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
 
  // Resend verification code
  const resendVerificationCode = async () => {
    try {
      setLoading(true);
      await signUp?.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Success', 'A new verification code has been sent');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend verification code');
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
 
  return (
    <View className="flex-1 bg-gray-50 p-6 justify-center -mt-10">
      {/* Header */}
      <View className="mb-12">
        <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
        <Text className="text-gray-500 mt-2">Join our community today</Text>
      </View>
 
      {/* Email/Password Form */}
      {!pendingVerification ? (
        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View className="flex-row items-center bg-white rounded-lg border border-gray-200 mt-1">
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
 
          {/* Şifre Güç Göstergesi */}
          {password.length > 0 && (
            <View className="mt-2 space-y-1">
              <View className="flex-row h-1.5 gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    className={`flex-1 rounded-full ${
                      level <= passwordStrength
                        ? passwordStrength < 3
                          ? 'bg-red-400'
                          : passwordStrength < 5
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </View>
              <Text className="text-xs text-gray-500">
                {passwordStrength < 3
                  ? 'Your password is weak'
                  : passwordStrength < 5
                    ? 'Your password is moderate'
                    : 'Your password is strong'}
              </Text>
            </View>
          )}
 
          {/* Terms and Privacy */}
          <View className="flex-row items-start mt-5">
            <TouchableOpacity
              className="p-1 mr-2"
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View className={`w-5 h-5 border rounded flex items-center justify-center ${agreedToTerms ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                {agreedToTerms && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
            </TouchableOpacity>
            <Text className="text-gray-600 flex-1 mt-1">
              I agree to the{' '}
              <Text className="text-blue-500">Terms of Service</Text> and{' '}
              <Text className="text-blue-500">Privacy Policy</Text>
            </Text>
          </View>
 
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg items-center mt-5"
            onPress={handleEmailSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        // Verification Code Input
        <View className="space-y-4">
          <Text className="text-gray-600 text-center">
            We've sent a verification code to {email}
          </Text>
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 text-center text-xl"
            placeholder="Enter 6-digit code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            className="bg-green-500 p-4 rounded-lg items-center"
            onPress={verifyEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">Verify Email</Text>
            )}
          </TouchableOpacity>
 
          <TouchableOpacity
            className="items-center mt-3"
            onPress={resendVerificationCode}
            disabled={loading}
          >
            <Text className="text-blue-500">Didn't receive a code? Resend</Text>
          </TouchableOpacity>
        </View>
      )}
 
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
 
      {/* Login Link */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/login" className="text-blue-500 font-medium">Sign In</Link>
      </View>
    </View>
  );
}