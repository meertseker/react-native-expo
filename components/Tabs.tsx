import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';  // Icon kütüphanesini import et
import Home from 'screens/Home';
import Settings from 'screens/Settings';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Header'ı gizleyebiliriz
          tabBarStyle: {
            backgroundColor: '#2f2f2f',  // Tab bar arka plan rengini değiştir
            borderTopWidth: 0,  // Kenar çizgilerini kaldır
            paddingBottom: 5,  // Alt boşluk ekle
          },
          tabBarActiveTintColor: '#7400b8',  // Aktif tab'ın rengini beyaz yap
          tabBarInactiveTintColor: '#aaa',  // Aktif olmayan tab'ların rengini gri yap
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
