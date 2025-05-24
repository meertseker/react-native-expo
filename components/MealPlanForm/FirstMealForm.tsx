import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  TextInput, 
  Alert,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { useUser } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type StepOneScreenProps = NativeStackNavigationProp<RootStackParamList, 'StepOne'>;

const StepOneScreen: React.FC = () => {
  const navigation = useNavigation<StepOneScreenProps>();
  const { formData, setUserInfo } = useMealPlanForm();
  const { user } = useUser();
  
  const [name, setName] = useState(formData.name || user?.firstName || '');
  const [age, setAge] = useState(formData.age?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female' | null>(
    formData.gender as 'male' | 'female' | null || null
  );

  useEffect(() => {
    if (user && !formData.name) {
      setName(user.firstName || '');
    }
  }, [user, formData.name]);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen adınızı giriniz.');
      return false;
    }
    if (age && (isNaN(parseInt(age)) || parseInt(age) < 1 || parseInt(age) > 120)) {
      Alert.alert('Geçersiz Yaş', 'Lütfen geçerli bir yaş giriniz (1-120).');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;

    setUserInfo({
      name: name.trim(),
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
    });

    navigation.navigate('AllergySelection');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            className="p-2 -ml-2"
            onPress={() => navigation.navigate('MainTabs')}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AllergySelection')}>
            <Text className="text-[#8A47EB] font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Hadi Başlayalım 👋
        </Text>
        <Text className="text-gray-600 text-base">
          Size özel beslenme planınızı oluşturmak için birkaç bilgiye ihtiyacımız var.
        </Text>

        {/* Progress Steps */}
        <View className="flex-row justify-between mt-6">
          {[1, 2, 3, 4].map((step) => (
            <View key={step} className="items-center flex-1">
              <View 
                className={`h-1 ${step === 1 ? 'bg-[#8A47EB]' : 'bg-gray-200'} 
                  ${step === 1 ? 'w-full' : 'w-full'}`}
              />
              <View 
                className={`w-8 h-8 rounded-full items-center justify-center mt-2
                  ${step === 1 ? 'bg-[#8A47EB]' : 'bg-gray-200'}`}
              >
                <Text className={step === 1 ? 'text-white' : 'text-gray-600'}>
                  {step}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* User Info from Clerk */}
        {user && (
          <View className="bg-[#F6F0FF] p-4 rounded-xl mt-6 mb-8">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="account-check" size={20} color="#8A47EB" />
              <Text className="text-[#8A47EB] font-semibold ml-2">Hesap Bilgileri</Text>
            </View>
            <Text className="text-gray-600">
              {user.emailAddresses[0]?.emailAddress}
            </Text>
          </View>
        )}
        
        {/* Name Input */}
        <View className="mb-8">
          <Text className="text-gray-700 font-medium text-lg mb-2">
            Adınız
            <Text className="text-[#8A47EB]">*</Text>
          </Text>
          <View className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 focus:border-[#8A47EB]">
            <TextInput
              className="text-lg text-gray-900"
              value={name}
              onChangeText={setName}
              placeholder="Adınızı girin"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        {/* Age Input */}
        <View className="mb-8">
          <Text className="text-gray-700 font-medium text-lg mb-2">
            Yaşınız
            <Text className="text-gray-400 font-normal"> (İsteğe bağlı)</Text>
          </Text>
          <View className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <TextInput
              className="text-lg text-gray-900"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="Örn: 25"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        {/* Gender Selection */}
        <View className="mb-8">
          <Text className="text-gray-700 font-medium text-lg mb-2">
            Cinsiyet
            <Text className="text-gray-400 font-normal"> (İsteğe bağlı)</Text>
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl border-2 ${
                gender === 'male' 
                  ? 'bg-[#F6F0FF] border-[#8A47EB]' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={() => setGender('male')}
            >
              <View className="items-center">
                <MaterialCommunityIcons 
                  name="gender-male" 
                  size={32} 
                  color={gender === 'male' ? '#8A47EB' : '#6B7280'} 
                />
                <Text className={`mt-2 font-medium ${
                  gender === 'male' ? 'text-[#8A47EB]' : 'text-gray-600'
                }`}>
                  Erkek
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl border-2 ${
                gender === 'female' 
                  ? 'bg-[#F6F0FF] border-[#8A47EB]' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={() => setGender('female')}
            >
              <View className="items-center">
                <MaterialCommunityIcons 
                  name="gender-female" 
                  size={32} 
                  color={gender === 'female' ? '#8A47EB' : '#6B7280'} 
                />
                <Text className={`mt-2 font-medium ${
                  gender === 'female' ? 'text-[#8A47EB]' : 'text-gray-600'
                }`}>
                  Kadın
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Steps */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <Text className="text-blue-800 font-semibold mb-2">Sonraki Adımlar</Text>
          <View className="space-y-2">
            <StepItem number={2} text="Gıda alerjilerinizi seçin" />
            <StepItem number={3} text="Vücut ölçülerinizi girin" />
            <StepItem number={4} text="Beslenme planı türünü seçin" />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="px-6 py-4 border-t border-gray-100">
        <TouchableOpacity 
          className="bg-[#8A47EB] py-4 rounded-xl items-center"
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">Devam Et</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const StepItem = ({ number, text }: { number: number; text: string }) => (
  <View className="flex-row items-center">
    <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
      <Text className="text-blue-800 text-xs font-medium">{number}</Text>
    </View>
    <Text className="text-blue-800 flex-1">{text}</Text>
  </View>
);

export default StepOneScreen;