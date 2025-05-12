import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { format } from 'date-fns';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Merhaba! Sana nasıl yardımcı olabilirim?', sender: 'bot', timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Bot cevabı simülasyonu
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Bunu not ettim! Başka bir şey sormak ister misin?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const renderItem = ({ item }: any) => (
    <View className={`flex mb-2 ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
      <View className={`rounded-xl px-4 py-2 max-w-[75%] ${item.sender === 'user' ? 'bg-purple-600' : 'bg-gray-300'}`}>
        <Text className={`${item.sender === 'user' ? 'text-white' : 'text-black'}`}>
          {item.text}
        </Text>
        <Text className="text-xs text-gray-500 mt-1 self-end">
          {format(item.timestamp, 'HH:mm')}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 px-4 pt-6">
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 shadow">
            <TextInput
              className="flex-1 text-base text-black"
              placeholder="Mesaj yaz..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Text className="text-purple-600 font-bold ml-2">Gönder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;