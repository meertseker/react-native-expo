import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type UserInfoScreenProps = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfoScreen: React.FC = () => {
  const navigation = useNavigation<UserInfoScreenProps>();
  
  // Form değerleri için state
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const handleNext = () => {
    // Burada form verilerini işleyebilir ve saklayabilirsiniz
    console.log('User Info:', { weight, height, targetWeight, activityLevel });
    navigation.navigate('FinalMealForm');
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
        <TouchableOpacity onPress={() => navigation.navigate('Final')}>
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
        
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${activityLevel === 'low' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => setActivityLevel('low')}
        >
          <Text className={`font-medium text-base ${activityLevel === 'low' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Düşük Aktivite
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Genellikle masa başı işler, nadiren egzersiz yaparım.
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${activityLevel === 'medium' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => setActivityLevel('medium')}
        >
          <Text className={`font-medium text-base ${activityLevel === 'medium' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Orta Aktivite
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Haftada 3-5 kez orta yoğunlukta egzersiz yaparım.
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`border rounded-lg p-4 mb-3 ${activityLevel === 'high' ? 'border-[#8A47EB] bg-[#F6F0FF]' : 'border-gray-300'}`}
          onPress={() => setActivityLevel('high')}
        >
          <Text className={`font-medium text-base ${activityLevel === 'high' ? 'text-[#8A47EB]' : 'text-black'}`}>
            Yüksek Aktivite
          </Text>
          <Text className="text-gray-600 text-xs mt-1">
            Hergün yoğun egzersiz yaparım veya fiziksel bir işte çalışırım.
          </Text>
        </TouchableOpacity>
        
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