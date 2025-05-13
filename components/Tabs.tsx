import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Home from '../screens/Home';
import Grocery from '../screens/Grocery';
import MealPlan from '../screens/MealPlan';
import Progress from '../screens/Progress';

const Tab = createBottomTabNavigator();


export default function Tabs({ navigation }: any) {

  const ChatButton = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat')}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons 
        name="message-text-outline" 
        size={24} 
        color="#A8B5DB" 
        style={{ 
          backgroundColor: 'transparent',
          borderRadius: 20,
          padding: 8
        }} 
      />
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#A8B5DB',
          tabBarItemStyle: {
            flex: 1,
            width: "100%",
            height: "100%",
            padding: 0,
            margin: 0,
            marginTop: 15,
          },
          tabBarStyle: {
            backgroundColor: "#0f0D23",
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 60,
            position: "absolute",
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#0f0D23",
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            padding: 0
          }
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons 
                name="home" 
                size={size} 
                color={color} 
                style={{ 
                  backgroundColor: color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: 20,
                  padding: 8
                }} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="Progress"
          component={Progress}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons 
                name="chart-line" 
                size={size} 
                color={color} 
                style={{ 
                  backgroundColor: color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: 20,
                  padding: 8
                }} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="ChatTab"
          component={Home} 
          options={{
            tabBarButton: () => <ChatButton />
          }}
        />
        <Tab.Screen
          name="MealPlan"
          component={MealPlan}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons 
                name="food-fork-drink" 
                size={size} 
                color={color} 
                style={{ 
                  backgroundColor: color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: 20,
                  padding: 8
                }} 
              />
            ),
          }}
        />
        <Tab.Screen
          name="Grocery"
          component={Grocery}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons 
                name="basket" 
                size={size} 
                color={color} 
                style={{ 
                  backgroundColor: color === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'transparent',
                  borderRadius: 20,
                  padding: 8
                }} 
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
}