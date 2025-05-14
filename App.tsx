import 'react-native-gesture-handler'; // Bu satırı en üstte tutun
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './components/Tabs';
import Chat from './screens/Chat';
import "./global.css"
import FirstMealForm from "./components/MealPlanForm/FirstMealForm"
import FinalMealForm from "./components/MealPlanForm/FinalMealForm"
import UserInfoScreen from 'components/MealPlanForm/UserInfo';
import AllergySelectionScreen from 'components/MealPlanForm/AllergySelection';



export type RootStackParamList = {
  Home: undefined;
  StepOne: undefined;
  AllergySelection: undefined;
  UserInfo: undefined;
  Final: undefined;
};
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
        <Stack.Screen name="FirstMealForm" component={FirstMealForm} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="AllergySelection" component={AllergySelectionScreen} />
        <Stack.Screen name="FinalMealForm" component={FinalMealForm} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}