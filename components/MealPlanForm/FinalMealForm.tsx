import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';

type FinalScreenProps = NativeStackNavigationProp<RootStackParamList, 'Final'>;

const FinalScreen: React.FC = () => {
  const navigation = useNavigation<FinalScreenProps>();
  const { formData, setPlanType, submitForm, isSubmitting } = useMealPlanForm();
  
  const [planType, setPlanTypeState] = useState<'balanced' | 'lowCarb' | 'highProtein'>(formData.planType);

  const handlePlanTypeChange = (type: 'balanced' | 'lowCarb' | 'highProtein') => {
    setPlanTypeState(type);
    setPlanType(type);
  };

  const handleFinish = async () => {
    try {
      const success = await submitForm();
      if (success) {
        Alert.alert(
          'Success!',
          'Your meal plan has been created successfully! You can now view it on the home screen.',
          [
            {
              text: 'View Plan',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to create your meal plan. Please check your information and try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getPlanTypeDescription = (type: string) => {
    switch (type) {
      case 'balanced':
        return 'Karbonhidrat, protein ve yağ dengeli olarak dağıtılır. Genel sağlık için idealdir.';
      case 'lowCarb':
        return 'Karbonhidrat miktarı sınırlı tutulur, protein ve sağlıklı yağlar arttırılır. Kilo vermek için etkilidir.';
      case 'highProtein':
        return 'Protein ağırlıklı beslenme planı. Kas gelişimi ve spor performansı için uygundur.';
      default:
        return '';
    }
  };

  const getPlanTypeName = (type: string) => {
    switch (type) {
      case 'balanced':
        return 'Dengeli Beslenme';
      case 'lowCarb':
        return 'Düşük Karbonhidrat';
      case 'highProtein':
        return 'Yüksek Proteinli';
      default:
        return '';
    }
  };

  const getActivityLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return 'Düşük Aktivite';
      case 'medium':
        return 'Orta Aktivite';
      case 'high':
        return 'Yüksek Aktivite';
      default:
        return level;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* İlerleme göstergesi */}
      <View className="flex-row items-center justify-between px-4 pt-4">
        <View className="flex-row space-x-3">
          <View className="h-3 w-3 rounded-full bg-[#EAEAEA] items-center justify-center">
            <Text className="text-xs text-black">1</Text>
          </View>
          <View className="h-3 w-3 rounded-full bg-[#EAEAEA] items-center justify-center">
            <Text className="text-xs text-black">2</Text>
          </View>
          <View className="h-3 w-3 rounded-full bg-[#EAEAEA] items-center justify-center">
            <Text className="text-xs text-black">3</Text>
          </View>
          <View className="h-3 w-3 rounded-full bg-[#8A47EB] items-center justify-center">
            <Text className="text-xs text-white">4</Text>
          </View>
        </View>
      </View>

      <ScrollView className="px-4 py-4">
        <Text className="text-black font-semibold text-lg mb-2">Beslenme Planı Türü</Text>
        
        <Text className="text-black text-xs mb-5">
          Son olarak, oluşturmak istediğiniz beslenme planı türünü seçin. 
          Tüm bilgileriniz ve tercihleriniz dikkate alınarak özel bir plan hazırlanacaktır.
        </Text>
        
        {/* Plan seçenekleri */}
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${planType === 'balanced' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => handlePlanTypeChange('balanced')}
        >
          <Text className={`font-medium text-base ${planType === 'balanced' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Dengeli Beslenme
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Karbonhidrat, protein ve yağ dengeli olarak dağıtılır. Genel sağlık için idealdir.
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${planType === 'lowCarb' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => handlePlanTypeChange('lowCarb')}
        >
          <Text className={`font-medium text-base ${planType === 'lowCarb' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Düşük Karbonhidrat
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Karbonhidrat miktarı sınırlı tutulur, protein ve sağlıklı yağlar arttırılır. Kilo vermek için etkilidir.
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${planType === 'highProtein' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => handlePlanTypeChange('highProtein')}
        >
          <Text className={`font-medium text-base ${planType === 'highProtein' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Yüksek Proteinli
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Protein ağırlıklı beslenme planı. Kas gelişimi ve spor performansı için uygundur.
          </Text>
        </TouchableOpacity>
        
        {/* Form Özeti */}
        <View className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
          <Text className="font-medium mb-3 text-base">Plan Özeti</Text>
          
          {formData.currentWeight && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600">Mevcut Kilo:</Text>
              <Text className="text-xs font-medium">{formData.currentWeight} kg</Text>
            </View>
          )}
          
          {formData.targetWeight && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600">Hedef Kilo:</Text>
              <Text className="text-xs font-medium">{formData.targetWeight} kg</Text>
            </View>
          )}
          
          {formData.height && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600">Boy:</Text>
              <Text className="text-xs font-medium">{formData.height} cm</Text>
            </View>
          )}
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-gray-600">Aktivite Seviyesi:</Text>
            <Text className="text-xs font-medium">{getActivityLevelText(formData.activityLevel)}</Text>
          </View>
          
          {formData.allergies.length > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-xs text-gray-600">Alerjiler:</Text>
              <Text className="text-xs font-medium">{formData.allergies.join(', ')}</Text>
            </View>
          )}
          
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Plan Türü:</Text>
            <Text className="text-xs font-medium">{getPlanTypeName(planType)}</Text>
          </View>
        </View>
        
        {/* Oluşturulacak İçerik */}
        <View className="bg-blue-50 p-4 rounded-lg mt-2 mb-8">
          <Text className="font-medium mb-2 text-blue-800">Oluşturulacak İçerikler</Text>
          <Text className="text-xs text-blue-600 mb-1">✓ 7 günlük kişiselleştirilmiş yemek planı</Text>
          <Text className="text-xs text-blue-600 mb-1">✓ Her öğün için detaylı malzeme listesi</Text>
          <Text className="text-xs text-blue-600 mb-1">✓ Otomatik market alışveriş listesi</Text>
          <Text className="text-xs text-blue-600 mb-1">✓ Günlük kalori ve makro besin değerleri</Text>
          <Text className="text-xs text-blue-600">✓ AI destekli beslenme önerileri</Text>
        </View>
        
        {/* Ekstra boşluk */}
        <View className="h-20" />
      </ScrollView>

      {/* Navigasyon butonları */}
      <View className="absolute bottom-8 flex-row w-full justify-between px-4">
        <TouchableOpacity 
          className="bg-[#F2F2F2] rounded px-4 py-2"
          onPress={() => navigation.navigate('UserInfo')}
          disabled={isSubmitting}
        >
          <Text className="text-black text-center font-bold text-xs">Önceki</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-[#8A47EB] rounded px-6 py-2 flex-row items-center"
          onPress={handleFinish}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="white" className="mr-2" />
              <Text className="text-white text-center font-bold text-xs">Oluşturuluyor...</Text>
            </>
          ) : (
            <Text className="text-white text-center font-bold text-xs">Planı Oluştur</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FinalScreen;