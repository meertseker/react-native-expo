import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Home from '../screens/Home';
import Grocery from '../screens/Grocery';
import MealPlan from '../screens/MealPlan';
import Progress from '../screens/Progress';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function Tabs({ navigation }: any) {

  const ChatButton: React.FC<BottomTabBarButtonProps> = (props) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat')}
      style={[
        props.style, 
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
          marginBottom: 8.5,
        }
      ]}
    >
      <MaterialCommunityIcons 
        name="message-text-outline" 
        size={24} 
        color="#A8B5DB" 
        style={{ 
          backgroundColor: 'transparent',
          borderRadius: 20,
          padding: 8,
        }} 
      />
    </TouchableOpacity>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#A8B5DB',
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          borderRadius: 30,
          marginHorizontal: 20,
          marginBottom: 20,
          height: 60,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          elevation: 8,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          paddingHorizontal: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
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
                borderRadius: 50,  // Ensures circular icon
                padding: 8,
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
                borderRadius: 50,  // Ensures circular icon
                padding: 8,
              }} 
            />
          ),
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
                borderRadius: 50,  // Ensures circular icon
                padding: 8,
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
                borderRadius: 50,  // Ensures circular icon
                padding: 8,
                display: "flex",
                alignContent: "center",
              }} 
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={Home}
        options={{
          tabBarButton: (props) => <ChatButton {...props} />
        }}
      />
    </Tab.Navigator>
  );
}
