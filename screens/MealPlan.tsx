
import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const startMealPlanCreation = () => {
    // İlk adıma git
    navigation.navigate('FirstMealForm');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center p-4">
        {/* App Logo */}

        
        <Text className="text-3xl font-bold text-center mb-2">Meal Planner</Text>
        <Text className="text-base text-gray-600 text-center mb-12 ">
          Sağlıklı beslenme planınızı kolayca oluşturun
        </Text>

        {/* Ana buton */}
        <TouchableOpacity 
          className="bg-[#8A47EB] w-full py-4 rounded-xl mb-4"
          onPress={startMealPlanCreation}
        >
          <Text className="text-white font-bold text-center text-lg">Yemek Planı Oluştur</Text>
        </TouchableOpacity>

        {/* İkincil buton */}
        <TouchableOpacity className="bg-[#F6F0FF] w-full py-4 rounded-xl">
          <Text className="text-[#8A47EB] font-bold text-center text-lg">Planlarımı Görüntüle</Text>
        </TouchableOpacity>

        {/* Özellikler */}
        <View className="w-full mt-12">
          <Text className="text-lg font-semibold mb-4">Özellikler</Text>
          
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-[#F6F0FF] rounded-full justify-center items-center mr-3">
              <Text className="text-[#8A47EB] font-bold">✓</Text>
            </View>
            <Text className="text-base">Kişiselleştirilmiş beslenme planları</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-[#F6F0FF] rounded-full justify-center items-center mr-3">
              <Text className="text-[#8A47EB] font-bold">✓</Text>
            </View>
            <Text className="text-base">Alerjen filtreleme</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-[#F6F0FF] rounded-full justify-center items-center mr-3">
              <Text className="text-[#8A47EB] font-bold">✓</Text>
            </View>
            <Text className="text-base">Kalori ve besin takibi</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;