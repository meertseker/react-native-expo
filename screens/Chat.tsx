import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initial greeting message when component mounts
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Merhaba! Bugün sana nasıl yardımcı olabilirim? İstediğin bir yemek tarifi var mı?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/recipe`, {
        userInput: inputText,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.recipe || 'Üzgünüm, bir hata oluştu.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error.response || error.message || error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Bağlantı hatası. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => {
    return (
      <View
        key={message.id}
        className={`mb-4 mx-2 p-3 rounded-lg max-w-3/4 ${
          message.isUser
            ? 'bg-blue-500 self-end rounded-tr-none'
            : 'bg-gray-200 self-start rounded-tl-none'
        }`}
      >
        <Text
          className={`text-base ${message.isUser ? 'text-white' : 'text-gray-800'}`}
        >
          {message.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            message.isUser ? 'text-blue-100 text-right' : 'text-gray-500'
          }`}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4">
        <Text className="text-xl font-bold text-center">Yemek Tarifi Asistanı</Text>
      </View>
      
      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerClassName="flex flex-col"
        >
          {messages.map(renderMessage)}
          
          {isLoading && (
            <View className="self-start bg-gray-200 p-3 rounded-lg mb-4 mx-2">
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
        </ScrollView>
        
        {/* Input area */}
        <View className="flex-row items-center border-t border-gray-200 p-2 bg-white">
          <TextInput
            className="flex-1 bg-gray-100 p-3 rounded-full mr-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="İstediğiniz yemek tarifini yazın..."
            placeholderTextColor="#888"
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
            className={`p-2 rounded-full ${
              inputText.trim() === '' || isLoading ? 'bg-blue-300' : 'bg-blue-500'
            }`}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;