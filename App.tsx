import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import Tabs from './components/Tabs';
import Chat from './screens/Chat';
import "./global.css"
import FirstMealForm from "./components/MealPlanForm/FirstMealForm"
import FinalMealForm from "./components/MealPlanForm/FinalMealForm"
import UserInfoScreen from 'components/MealPlanForm/UserInfo';
import AllergySelectionScreen from 'components/MealPlanForm/AllergySelection';
import MealPlansScreen from 'components/UserMealPlans';
import MealPlanDetails from 'components/MealPlanDetails';
import SignUpScreen from 'screens/SignUp';
import LoginScreen from './LoginScreen';
import { MealPlanFormProvider } from './contexts/MealPlanFormContext';

export type RootStackParamList = {
  Home: undefined;
  StepOne: undefined;
  AllergySelection: undefined;
  UserInfo: undefined;
  Final: undefined;
  MainTabs: undefined;
  Chat: undefined;
  FirstMealForm: undefined;
  FinalMealForm: undefined;
  UserMeals: undefined;
  MealPlanDetails: undefined;
  Login: undefined;
  SignUp: undefined;
};

const Stack = createStackNavigator();

// Auth durumunu kontrol eden ayrı bir component
function MainApp() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <MealPlanFormProvider>
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
            options={{ headerShown: false }}
          />
          <Stack.Screen name="FirstMealForm" component={FirstMealForm} options={{ headerShown: false }} />
          <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AllergySelection" component={AllergySelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="FinalMealForm" component={FinalMealForm} options={{ headerShown: false }} />
          <Stack.Screen name="UserMeals" component={MealPlansScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MealPlanDetails" component={MealPlanDetails} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MealPlanFormProvider>
  );
}

export default function App() {
  return (
    <ClerkProvider 
      publishableKey="pk_test_dGhhbmtmdWwtaW1wYWxhLTkuY2xlcmsuYWNjb3VudHMuZGV2JA"

    >
      <MainApp />
    </ClerkProvider>
  );
}