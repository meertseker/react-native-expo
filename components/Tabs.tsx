import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import Home from '../screens/Home';
import MealPlan from '../screens/MealPlan';
import Progress from '../screens/Progress';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const Tab = createBottomTabNavigator();

export default function Tabs({ navigation }: any) {
  const chatScale = useSharedValue(1);
  
  const animatedChatStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chatScale.value }],
  }));

  const handleChatPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    chatScale.value = withSpring(0.85, {}, () => {
      chatScale.value = withSpring(1);
    });
    navigation.navigate('Chat');
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginBottom: 4,
          },
          tabBarActiveTintColor: '#8A47EB',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarItemStyle: {
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 8,
          },
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 85,
            paddingBottom: 20,
            paddingTop: 5,
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <View 
                className="items-center justify-center"
                style={{
                  backgroundColor: focused ? '#8A47EB15' : 'transparent',
                  borderRadius: 12,
                  width: 48,
                  height: 32,
                }}
              >
                <MaterialCommunityIcons 
                  name={focused ? "home" : "home-outline"} 
                  size={24} 
                  color={color} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Meals"
          component={MealPlan}
          options={{
            headerShown: false,
            tabBarLabel: 'Meals',
            tabBarIcon: ({ color, size, focused }) => (
              <View 
                className="items-center justify-center"
                style={{
                  backgroundColor: focused ? '#8A47EB15' : 'transparent',
                  borderRadius: 12,
                  width: 48,
                  height: 32,
                }}
              >
                <MaterialCommunityIcons 
                  name={focused ? "food-fork-drink" : "food-outline"} 
                  size={24} 
                  color={color} 
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={Progress}
          options={{
            headerShown: false,
            tabBarLabel: 'Progress',
            tabBarIcon: ({ color, size, focused }) => (
              <View 
                className="items-center justify-center"
                style={{
                  backgroundColor: focused ? '#8A47EB15' : 'transparent',
                  borderRadius: 12,
                  width: 48,
                  height: 32,
                }}
              >
                <MaterialCommunityIcons 
                  name={focused ? "chart-line" : "chart-line-variant"} 
                  size={24} 
                  color={color} 
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
      
      {/* Floating AI Chat Button */}
      <Animated.View 
        style={[
          animatedChatStyle,
          {
            position: 'absolute',
            bottom: 110,
            right: 20,
            zIndex: 1000,
          }
        ]}
      >
        <TouchableOpacity
          onPress={handleChatPress}
          className="w-14 h-14 bg-[#8A47EB] rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: '#8A47EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons 
            name="robot-outline" 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
