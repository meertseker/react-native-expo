import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useMealPlanForm } from '../../contexts/MealPlanFormContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AllergySelectionScreenProps = NativeStackNavigationProp<RootStackParamList, 'AllergySelection'>;

const allergyOptions = [
  { key: 'milk', name: 'Süt', icon: 'cup', description: 'Süt ve süt ürünleri' },
  { key: 'eggs', name: 'Yumurta', icon: 'egg', description: 'Tüm yumurta çeşitleri' },
  { key: 'nuts', name: 'Kuruyemiş', icon: 'peanut', description: 'Fındık, badem, ceviz vb.' },
  { key: 'fish', name: 'Balık', icon: 'fish', description: 'Tüm balık türleri' },
  { key: 'shellfish', name: 'Kabuklu Deniz Ürünleri', icon: 'shrimp', description: 'Karides, yengeç vb.' },
  { key: 'wheat', name: 'Buğday', icon: 'grain', description: 'Buğday ve türevleri' },
  { key: 'soy', name: 'Soya', icon: 'soy-sauce', description: 'Soya ve soya ürünleri' },
  { key: 'gluten', name: 'Gluten', icon: 'bread-slice', description: 'Buğday, arpa, çavdar vb.' },
];

const AllergySelectionScreen: React.FC = () => {
  const navigation = useNavigation<AllergySelectionScreenProps>();
  const { formData, setAllergies } = useMealPlanForm();
  
  const [selectedAllergies, setSelectedAllergies] = useState<Set<string>>(() => {
    const initialState = new Set<string>();
    formData.allergies.forEach(allergy => {
      const option = allergyOptions.find(opt => opt.name === allergy);
      if (option) initialState.add(option.key);
    });
    return initialState;
  });

  const toggleAllergy = (key: string) => {
    setSelectedAllergies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    const selectedAllergyNames = Array.from(selectedAllergies).map(key => {
      const option = allergyOptions.find(opt => opt.key === key);
      return option?.name || '';
    }).filter(Boolean);
    
    setAllergies(selectedAllergyNames);
    navigation.navigate('UserInfo');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            className="p-2 -ml-2"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
            <Text className="text-[#8A47EB] font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Alerjileriniz 🍽️
        </Text>
        <Text className="text-gray-600 text-base">
          Size özel beslenme planınızda dikkate alacağımız alerjilerinizi seçin.
        </Text>

        {/* Progress Steps */}
        <View className="flex-row justify-between mt-6">
          {[1, 2, 3, 4].map((step) => (
            <View key={step} className="items-center flex-1">
              <View 
                className={`h-1 ${step <= 2 ? 'bg-[#8A47EB]' : 'bg-gray-200'} 
                  ${step === 2 ? 'w-full' : 'w-full'}`}
              />
              <View 
                className={`w-8 h-8 rounded-full items-center justify-center mt-2
                  ${step <= 2 ? 'bg-[#8A47EB]' : 'bg-gray-200'}`}
              >
                <Text className={step <= 2 ? 'text-white' : 'text-gray-600'}>
                  {step}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Selected Allergies Summary */}
        {selectedAllergies.size > 0 && (
          <View className="bg-[#F6F0FF] p-4 rounded-xl mb-6">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="alert-circle" size={20} color="#8A47EB" />
              <Text className="text-[#8A47EB] font-semibold ml-2">Seçilen Alerjiler</Text>
            </View>
            <Text className="text-gray-600">
              {Array.from(selectedAllergies).map(key => {
                const option = allergyOptions.find(opt => opt.key === key);
                return option?.name;
              }).join(', ')}
            </Text>
          </View>
        )}

        {/* Allergy Grid */}
        <View className="flex-row flex-wrap justify-between">
          {allergyOptions.map((allergy) => (
            <TouchableOpacity
              key={allergy.key}
              className={`w-[48%] mb-4 p-4 rounded-xl border-2 ${
                selectedAllergies.has(allergy.key)
                  ? 'bg-[#F6F0FF] border-[#8A47EB]'
                  : 'bg-gray-50 border-gray-200'
              }`}
              onPress={() => toggleAllergy(allergy.key)}
            >
              <View className="items-center">
                <MaterialCommunityIcons 
                  name={allergy.icon as any}
                  size={32}
                  color={selectedAllergies.has(allergy.key) ? '#8A47EB' : '#6B7280'}
                />
                <Text className={`mt-2 font-medium text-center ${
                  selectedAllergies.has(allergy.key) ? 'text-[#8A47EB]' : 'text-gray-900'
                }`}>
                  {allergy.name}
                </Text>
                <Text className="text-xs text-gray-500 text-center mt-1">
                  {allergy.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 p-4 rounded-xl mb-8">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
            <Text className="text-blue-800 font-semibold ml-2">Önemli Not</Text>
          </View>
          <Text className="text-blue-600 text-sm">
            Seçtiğiniz alerjiler meal planınızda dikkate alınacak ve bu besinleri içeren 
            yemekler önerilmeyecektir. Eğer ciddi alerjileriniz varsa, lütfen bir 
            sağlık uzmanından da tavsiye alın.
          </Text>
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

export default AllergySelectionScreen;