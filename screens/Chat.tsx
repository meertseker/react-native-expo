import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import ChatBubble from "../components/ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";
import { GEMINI_API_KEY } from '@env';

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <View>
      <Text>Chat</Text>
    </View>
  )
}

export default Chat