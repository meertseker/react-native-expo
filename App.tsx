import 'react-native-gesture-handler'; // Bu satırı en üstte tutun
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './components/Tabs';
import Chat from './screens/Chat';
import "./global.css"

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="MainTabs" 
            component={Tabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Chat" 
            component={Chat}
            options={{
              headerShown: false
              }
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}