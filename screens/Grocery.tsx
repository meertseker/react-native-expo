import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import Checkbox from 'expo-checkbox'; // <== bunu eklediğinden emin ol

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const mockMealPlans = [
  {
    id: '1',
    name: 'Yüksek Protein Planı',
    kcal: 2200,
    createdAt: new Date('2025-05-13'),
    startTime: '07:30',
    mealsCount: 4,
    macros: { protein: 45, fat: 25, carbs: 30 },
    groceryList: ['Tavuk Göğsü', 'Yumurta', 'Lor Peyniri', 'Kefir', 'Badem', 'Ton Balığı']
  },
  {
    id: '2',
    name: 'Vegan Öğle Planı',
    kcal: 1500,
    createdAt: new Date('2025-05-14'),
    startTime: '12:00',
    mealsCount: 3,
    macros: { protein: 20, fat: 30, carbs: 50 },
    groceryList: ['Nohut', 'Avokado', 'Kinoa', 'Hurma', 'Brokoli', 'Zeytinyağı']
  },
  {
    id: '3',
    name: 'Karma Plan',
    kcal: 1800,
    createdAt: new Date('2025-05-15'),
    startTime: '09:00',
    mealsCount: 10,
    macros: { protein: 35, fat: 20, carbs: 45 },
    groceryList: [
      'Tavuk Göğsü', 'Zeytinyağı', 'Patates', 'Peynir', 'Yulaf', 'Avokado',
      'Meyve Suyu', 'Brokoli', 'Salatalık', 'Badem'
    ]
  }
];

const GroceryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'latest' | 'kcal' | 'protein'>('latest');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: Set<string> }>({});

  const filteredPlans = mockMealPlans
    .filter(plan => plan.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'kcal':
          return b.kcal - a.kcal;
        case 'protein':
          return b.macros.protein - a.macros.protein;
        default:
          return 0;
      }
    });

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedPlanId(prev => (prev === id ? null : id));
  };

  const toggleCheck = (planId: string, item: string) => {
    setCheckedItems(prev => {
      const currentSet = new Set(prev[planId] || []);
      if (currentSet.has(item)) {
        currentSet.delete(item);
      } else {
        currentSet.add(item);
      }
      return { ...prev, [planId]: currentSet };
    });
  };

  const addToList = (planName: string) => {
    console.log(`"${planName}" listene eklendi.`);
  };

  return (
    <ImageBackground
      source={require('../assets/apple.png')}
      resizeMode="cover"
      className="flex-1"
    >
      <View className="p-6 flex-1 bg-black/40 backdrop-blur-lg">
        <Text className="text-white text-4xl font-bold mb-5 mt-14">
          Meal Plans Overview
        </Text>

        <TextInput
          className="bg-white/80 text-gray-800 rounded-full p-3 mb-4 text-base shadow-md"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Plan ismi ara"
          placeholderTextColor="#AAA"
        />

        <View className="flex-row mb-6 justify-between">
          {['latest', 'kcal', 'protein'].map(option => (
            <TouchableOpacity
              key={option}
              className={`px-4 py-2 rounded-full ${sortOption === option ? 'bg-purple-600' : 'bg-white/60'}`}
              onPress={() => setSortOption(option as any)}
            >
              <Text className={`text-sm font-semibold ${sortOption === option ? 'text-white' : 'text-gray-800'}`}>
                Sort by {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isExpanded = item.id === expandedPlanId;
            const checkedSet = checkedItems[item.id] || new Set();

            return (
              <View className="bg-white/80 rounded-2xl mb-6 p-6 shadow-lg">
                <View className="flex-row justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">{item.name}</Text>
                    <Text className="text-base text-gray-600 mb-1">Kcal: {item.kcal}</Text>
                    <Text className="text-sm text-gray-500 mb-2">Oluşturulma: {item.createdAt.toLocaleDateString()}</Text>

                    {isExpanded && (
                      <View className="space-y-1">
                        <Text className="text-sm text-gray-700">Başlangıç Saati: {item.startTime}</Text>
                        <Text className="text-sm text-gray-700">Öğün Sayısı: {item.mealsCount}</Text>
                        <Text className="text-sm text-gray-700">Protein: {item.macros.protein}%</Text>
                        <Text className="text-sm text-gray-700">Yağ: {item.macros.fat}%</Text>
                        <Text className="text-sm text-gray-700">Karbonhidrat: {item.macros.carbs}%</Text>

                        <TouchableOpacity
                          className="mt-3 bg-green-600 rounded-full px-4 py-2 self-start"
                          onPress={() => addToList(item.name)}
                        >
                          <Text className="text-white font-semibold text-sm">Listeye Ekle</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <TouchableOpacity
                      className="mt-4 bg-purple-500 rounded-full px-4 py-2 self-start"
                      onPress={() => toggleExpand(item.id)}
                    >
                      <Text className="text-white font-semibold text-sm">
                        {isExpanded ? 'Kapat' : 'View'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isExpanded && (
                    <View className="w-36 pl-2 border-l border-gray-300">
                      <Text className="text-gray-800 font-semibold mb-2">Alışveriş:</Text>
                      {item.groceryList.map((grocery, index) => {
                        const isChecked = checkedSet.has(grocery);
                        return (
                          <View key={index} className="flex-row items-center mb-1">
                            <Checkbox
                              value={isChecked}
                              onValueChange={() => toggleCheck(item.id, grocery)}
                              color={isChecked ? '#4F46E5' : undefined}
                            />
                            <Text className={`ml-2 text-sm ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {grocery}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default GroceryList;
