import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GroceryList = () => {
  const [items, setItems] = useState<{ id: string, name: string, quantity: number }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('1');

  const addItem = () => {
    if (newItem.trim() === '') return;

    setItems([
      ...items,
      { id: Date.now().toString(), name: newItem, quantity: parseInt(newQuantity) },
    ]);
    setNewItem('');
    setNewQuantity('1');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <ImageBackground
      source={require('../assets/grocery-bg2.png')}
      resizeMode="cover" // 'stretch' yerine 'cover' kullanmak daha uygun olabilir
      className="flex-1"
    >
      <View className="p-6 flex-1 bg-black/40 backdrop-blur-lg"> 

        <Text className="text-white text-4xl font-bold mb-5 mt-14">
          Find Your Daily Grocery
        </Text>

        <View className="flex-row mb-4">
          <TextInput
            className="flex-1 bg-white/80 text-gray-800 rounded-full p-3 mr-2 text-base shadow-md align-middle"
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add an item"
            placeholderTextColor="#AAA"
          />
          <TextInput
            className="w-20 bg-white/80 text-gray-800 rounded-full p-3 text-base shadow-md"
            value={newQuantity}
            onChangeText={setNewQuantity}
            keyboardType="numeric"
            placeholder="Qty"
            placeholderTextColor="#AAA"
          />
        </View>

        <TouchableOpacity
          onPress={addItem}
          className="bg-green-500/80 py-3 px-6 rounded-full items-center justify-center mb-6"
        >
          <Text className="text-white text-lg font-semibold">Add Item</Text>
        </TouchableOpacity>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white/75 rounded-lg mb-4 p-4 flex-row justify-between items-center shadow-md">
              <View>
                <Text className="text-gray-800 text-xl">{item.name}</Text>
                <Text className="text-gray-600 text-sm">{item.quantity} pcs</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(item.id)}>
                <Ionicons name="trash-bin-outline" size={24} color="#FF4040" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

export default GroceryList;
