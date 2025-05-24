import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@clerk/clerk-expo';
import apiService from '../services/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];
}

interface Recipe {
  name: string;
  prepTime: string;
  difficulty: string;
  tags: string[];
}

const TypingIndicator = () => {
  return (
    <View className="flex-row items-center p-2">
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          className="w-2 h-2 bg-gray-500 rounded-full mx-1 animate-pulse"
        />
      ))}
    </View>
  );
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initial greeting message when component mounts
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: `Merhaba ${user?.firstName || 'Kullanıcı'}! Ben GainAI, senin kişisel beslenme asistanınım. Bugün nasıl yardımcı olabilirim? Yemek tarifi, beslenme önerisi veya herhangi bir sorun sorabilirsin.`,
        isUser: false,
        timestamp: new Date(),
        options: [
          "Bugün ne yemek yapabilirim?", 
          "Protein açısından zengin yemek öner", 
          "Kilo verme için nasıl beslenmeliyim?",
          "Spor öncesi ne yemeliyim?"
        ]
      },
    ]);
  }, [user]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async (text: string = inputText) => {
    if (text.trim() === '' || !user?.id) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiService.chatWithBot({
        userInput: text,
        clerk_user_id: user.id
      });

      let botText;
      let botOptions: string[] = [];
      
      if (response.name) {
        // Handle recipe response
        botText = JSON.stringify(response);
      } else if (response.text) {
        // Handle conversational response
        botText = response.text;
        botOptions = response.options || [];
      } else {
        botText = 'Üzgünüm, bir hata oluştu.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        isUser: false,
        timestamp: new Date(),
        options: botOptions,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    sendMessage(option);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  // Show date separator
  const renderDateHeader = () => {
    return (
      <View className="flex items-center my-2">
        <Text className="text-xs text-gray-500">
          {new Intl.DateTimeFormat('tr-TR', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date())}
        </Text>
      </View>
    );
  };

  // Render recipe card - for recipe responses that can be parsed as JSON
  const renderRecipeCard = (message: Message) => {
    try {
      const recipe: Recipe = JSON.parse(message.text);
      
      return (
        <View key={message.id} className="mb-4 mx-4">
          <View className="bg-purple-50 p-4 rounded-3xl">
            <Text className="text-[#8A47EB] text-base font-medium text-right">{recipe.name}</Text>
            
            <View className="mt-3 items-end">
              <View className="flex-row items-center justify-end">
                <Text className="text-sm font-medium text-gray-800">{recipe.prepTime}</Text>
                <View className="w-1 h-1 bg-gray-300 rounded-full mx-2"></View>
                <Text className="text-sm font-medium text-gray-800">{recipe.difficulty}</Text>
              </View>
              
              <View className="flex-row mt-3 gap-2">
                {recipe.tags.map((tag, index) => (
                  <View key={index} className="bg-white px-3 py-1.5 rounded-2xl flex-row items-center">
                    <Text className="text-sm text-gray-500 font-medium mr-1.5">{tag}</Text>
                    <Ionicons 
                      name={
                        tag.includes("Vegan") || tag.includes("Vejetaryen") ? "leaf-outline" : 
                        tag.includes("Kolay") || tag.includes("Quick") ? "time-outline" : 
                        "restaurant-outline"
                      } 
                      size={16} 
                      color="#8A47EB" 
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      );
    } catch (e) {
      // If parsing fails, render as normal message
      return renderNormalMessage(message);
    }
  };

  // Render normal message
  const renderNormalMessage = (message: Message, showAvatar = true) => {
    if (message.isUser) {
      return (
        <View key={message.id} className="mb-4 ml-12 mr-4">
          <View className="bg-[#8A47EB] p-4 rounded-3xl rounded-tr-sm self-end">
            <Text className="text-white text-base">{message.text}</Text>
          </View>
          <Text className="text-xs text-gray-400 text-right mt-1">
            {formatTime(message.timestamp)}
          </Text>
        </View>
      );
    }
    
    return (
      <View key={message.id} className="mb-4 mx-4 flex-row">
        {showAvatar && (
          <View className="w-8 h-8 bg-purple-50 rounded-md mr-2 items-center justify-center">
            <Ionicons name="nutrition" size={16} color="#8A47EB" />
          </View>
        )}
        <View className="flex-1">
          <View className="bg-gray-100 p-4 rounded-3xl rounded-tl-sm">
            <Text className="text-gray-800 text-base">{message.text}</Text>
          </View>
          <Text className="text-xs text-gray-400 mt-1">
            {formatTime(message.timestamp)}
          </Text>
          
          {message.options && message.options.length > 0 && (
            <View className="mt-4 gap-2">
              {message.options.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  className="bg-purple-50 py-2.5 px-4 rounded-3xl border border-purple-100"
                  onPress={() => handleOptionClick(option)}
                >
                  <Text className="text-[#8A47EB] text-base font-medium">{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };
  
  // Render message based on type
  const renderMessage = (message: Message, index: number) => {
    // Check if it's a JSON message (recipe card)
    if (!message.isUser && message.text.startsWith('{')) {
      return renderRecipeCard(message);
    }
    
    // For regular messages, check if we need to show the avatar
    if (!message.isUser && index > 0) {
      const prevMessage = messages[index - 1];
      const showAvatar = prevMessage.isUser;
      return renderNormalMessage(message, showAvatar);
    }
    
    return renderNormalMessage(message);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: `Merhaba ${user?.firstName || 'Kullanıcı'}! Ben GainAI, senin kişisel beslenme asistanınım. Bugün nasıl yardımcı olabilirim?`,
        isUser: false,
        timestamp: new Date(),
        options: [
          "Bugün ne yemek yapabilirim?", 
          "Protein açısından zengin yemek öner", 
          "Kilo verme için nasıl beslenmeliyim?",
          "Spor öncesi ne yemeliyim?"
        ]
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-4 pb-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-11 h-11 border border-gray-200 rounded-md items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#72777A" />
        </TouchableOpacity>
        
        <View className="flex-row items-center gap-3">
          <View className="w-11 h-11 bg-purple-50 rounded-md items-center justify-center">
            <Ionicons name="nutrition" size={20} color="#8A47EB" />
          </View>
          <View>
            <Text className="font-bold text-sm text-gray-900">GainAI</Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-2 h-2 bg-green-400 rounded-full mr-1"></View>
              <Text className="text-xs text-gray-500">Online</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          className="w-11 h-11 border border-gray-200 rounded-md items-center justify-center"
          onPress={clearChat}
        >
          <Ionicons name="refresh" size={20} color="#72777A" />
        </TouchableOpacity>
      </View>
      
      {/* Chat Container */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-white"
          contentContainerStyle={{ paddingVertical: 16 }}
        >
          {renderDateHeader()}
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isLoading && (
            <View className="ml-10 bg-gray-100 p-2 rounded-3xl rounded-tl-sm mx-4 self-start">
              <TypingIndicator />
            </View>
          )}
        </ScrollView>
        
        {/* Input Container */}
        <View className="bg-white py-4 px-6 border-t border-gray-100">
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center border border-gray-300 rounded-full px-5 py-3">
              <TextInput
                className="flex-1 text-base text-gray-800"
                value={inputText}
                onChangeText={setInputText}
                placeholder="Beslenme hakkında sorun..."
                placeholderTextColor="#72777A"
                multiline
                maxLength={1000}
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
              />
            </View>
            <TouchableOpacity
              onPress={() => sendMessage()}
              disabled={inputText.trim() === '' || isLoading}
              className={`w-11 h-11 rounded-full items-center justify-center ml-3 ${
                inputText.trim() === '' || isLoading ? 'bg-gray-300' : 'bg-[#8A47EB]'
              }`}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;