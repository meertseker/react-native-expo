import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { useUser } from '@clerk/clerk-expo';

type UserInfoScreenProps = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen: React.FC = () => {
  const navigation = useNavigation<UserInfoScreenProps>();
  const { formData, setPhysicalData, setUserInfo } = useMealPlanForm();
  const { user } = useUser();
  
  // Form değerleri için state - formData'dan başlat
  const [weight, setWeight] = useState(formData.currentWeight);
  const [height, setHeight] = useState(formData.height);
  const [targetWeight, setTargetWeight] = useState(formData.targetWeight);
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>(formData.activityLevel);

  // Set user info from Clerk data on component mount
  useEffect(() => {
    if (user && !formData.name) {
      setUserInfo({
        name: user.firstName || 'User',
        age: undefined, // We don't have age from Clerk
        gender: undefined, // We don't have gender from Clerk
      });
    }
  }, [user, formData.name, setUserInfo]);

  const validateForm = () => {
    if (!weight.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen mevcut kilonuzu giriniz.');
      return false;
    }
    if (!height.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen boyunuzu giriniz.');
      return false;
    }
    if (!targetWeight.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen hedef kilonuzu giriniz.');
      return false;
    }

    // Validate numeric values
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const targetWeightNum = parseFloat(targetWeight);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli bir kilo değeri giriniz (1-300 kg).');
      return false;
    }
    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 250) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli bir boy değeri giriniz (1-250 cm).');
      return false;
    }
    if (isNaN(targetWeightNum) || targetWeightNum <= 0 || targetWeightNum > 300) {
      Alert.alert('Geçersiz Değer', 'Lütfen geçerli bir hedef kilo değeri giriniz (1-300 kg).');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    // Save physical data to context
    setPhysicalData({
      currentWeight: weight,
      targetWeight: targetWeight,
      height: height,
      activityLevel: activityLevel,
    });

    navigation.navigate('FinalMealForm');
  };

  const getActivityDescription = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Genellikle masa başı işler, nadiren egzersiz yaparım.';
      case 'medium':
        return 'Haftada 3-5 kez orta yoğunlukta egzersiz yaparım.';
      case 'high':
        return 'Hergün yoğun egzersiz yaparım veya fiziksel bir işte çalışırım.';
    }
  };

  const getActivityTitle = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'Düşük Aktivite';
      case 'medium':
        return 'Orta Aktivite';
      case 'high':
        return 'Yüksek Aktivite';
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
          <View className="h-3 w-3 rounded-full bg-[#8A47EB] items-center justify-center">
            <Text className="text-xs text-white">3</Text>
          </View>
          <View className="h-3 w-3 rounded-full bg-[#EAEAEA] items-center justify-center">
            <Text className="text-xs text-black">4</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('FinalMealForm')}>
          <Text className="text-[#1F73F1] font-bold text-xs">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4 py-4">
        <Text className="text-black font-semibold text-lg mb-2">Vücut Bilgileriniz</Text>
        
        <Text className="text-black text-xs mb-5">
          Beslenme planınızı kişiselleştirmek ve kalori ihtiyacınızı doğru hesaplamak için 
          lütfen aşağıdaki bilgileri doldurun.
        </Text>
        
        <View className="flex-row justify-between mb-3">
          <View className="w-[48%]">
            <Text className="text-black font-medium mb-1">Mevcut Kilonuz (kg)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Örn: 75"
            />
          </View>
          
          <View className="w-[48%]">
            <Text className="text-black font-medium mb-1">Boyunuz (cm)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholder="Örn: 175"
            />
          </View>
        </View>
        
        <Text className="text-black font-medium mb-1">Hedef Kilonuz (kg)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
          placeholder="Örn: 70"
        />
        
        <Text className="text-black font-medium mb-3">Aktivite Seviyeniz</Text>
        
        {(['low', 'medium', 'high'] as const).map((level) => (
          <TouchableOpacity 
            key={level}
            className={`border rounded-lg p-4 mb-3 ${activityLevel === level ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
            onPress={() => setActivityLevel(level)}
          >
            <Text className={`font-medium text-base ${activityLevel === level ? 'text-[#8A47EB]' : 'text-black'}`}>
              {getActivityTitle(level)}
            </Text>
            <Text className="text-gray-600 text-xs mt-1">
              {getActivityDescription(level)}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* BMI Hesaplama Bilgisi */}
        {weight && height && (
          <View className="bg-green-50 p-4 rounded-lg mt-4 mb-4">
            <Text className="font-medium mb-2 text-green-800">Hesaplanan Bilgiler</Text>
            {(() => {
              const weightNum = parseFloat(weight);
              const heightNum = parseFloat(height);
              if (!isNaN(weightNum) && !isNaN(heightNum) && heightNum > 0) {
                const bmi = weightNum / Math.pow(heightNum / 100, 2);
                let bmiCategory = '';
                if (bmi < 18.5) bmiCategory = 'Zayıf';
                else if (bmi < 25) bmiCategory = 'Normal';
                else if (bmi < 30) bmiCategory = 'Fazla Kilolu';
                else bmiCategory = 'Obez';
                
                return (
                  <>
                    <Text className="text-xs text-green-600 mb-1">
                      BMI: {bmi.toFixed(1)} ({bmiCategory})
                    </Text>
                    {targetWeight && (
                      <Text className="text-xs text-green-600">
                        Hedef: {Math.abs(parseFloat(targetWeight) - weightNum).toFixed(1)} kg {parseFloat(targetWeight) > weightNum ? 'almanız' : 'vermeniz'} gerekiyor
                      </Text>
                    )}
                  </>
                );
              }
              return null;
            })()}
          </View>
        )}
        
        {/* Ek bilgi alanı */}
        <View className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
          <Text className="font-medium mb-2">Bilgilendirme</Text>
          <Text className="text-xs text-gray-600">
            Verdiğiniz bilgiler doğrultusunda günlük kalori ihtiyacınız ve besin değeri dağılımınız 
            hesaplanacaktır. Hesaplamalar genel formüller üzerinden yapılır ve kişisel sağlık durumunuza 
            göre değişiklik gösterebilir.
          </Text>
        </View>
        
        {/* Ekstra boşluk */}
        <View className="h-20" />
      </ScrollView>

      {/* Navigasyon butonları */}
      <View className="absolute bottom-8 flex-row w-full justify-between px-4">
        <TouchableOpacity 
          className="bg-[#F2F2F2] rounded px-4 py-2"
          onPress={() => navigation.navigate('AllergySelection')}
        >
          <Text className="text-black text-center font-bold text-xs">Önceki</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-[#8A47EB] rounded px-4 py-2"
          onPress={handleNext}
        >
          <Text className="text-white text-center font-bold text-xs">Sonraki</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserInfoScreen;