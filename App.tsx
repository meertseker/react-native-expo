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
import MealScanner from './screens/MealScanner';
import ManualMealLog from './screens/ManualMealLog';
import { MealPlanFormProvider } from './contexts/MealPlanFormContext';
import { MealPlanProvider } from './contexts/MealPlanContext';
import DietaryPreferences from './components/MealPlanForm/DietaryPreferences';
import MealFrequency from './components/MealPlanForm/MealFrequency';
import CookingSkills from './components/MealPlanForm/CookingSkills';
import MealTiming from './components/MealPlanForm/MealTiming';
import ReviewPlan from './components/MealPlanForm/ReviewPlan';
import QuickStartOnboarding from './components/QuickStartOnboarding';
import Grocery from './screens/Grocery';
import Settings from './screens/Settings';

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
  MealScanner: undefined;
  Progress: undefined;
  ManualMealLog: undefined;
  DietaryPreferences: undefined;
  MealFrequency: undefined;
  CookingSkills: undefined;
  MealTiming: undefined;
  ReviewPlan: undefined;
  QuickStartOnboarding: undefined;
  Grocery: undefined;
  Settings: undefined;
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
      <MealPlanProvider>
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
            <Stack.Screen name="DietaryPreferences" component={DietaryPreferences} options={{ headerShown: false }} />
            <Stack.Screen name="MealFrequency" component={MealFrequency} options={{ headerShown: false }} />
            <Stack.Screen name="CookingSkills" component={CookingSkills} options={{ headerShown: false }} />
            <Stack.Screen name="MealTiming" component={MealTiming} options={{ headerShown: false }} />
            <Stack.Screen name="ReviewPlan" component={ReviewPlan} options={{ headerShown: false }} />
            <Stack.Screen name="FinalMealForm" component={FinalMealForm} options={{ headerShown: false }} />
            <Stack.Screen name="UserMeals" component={MealPlansScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MealPlanDetails" component={MealPlanDetails} options={{ headerShown: false }} />
            <Stack.Screen name="MealScanner" component={MealScanner} options={{ headerShown: false }} />
            <Stack.Screen name="ManualMealLog" component={ManualMealLog} options={{ headerShown: false }} />
            <Stack.Screen name="QuickStartOnboarding" component={QuickStartOnboarding} options={{ headerShown: false }} />
            <Stack.Screen name="Grocery" component={Grocery} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </MealPlanProvider>
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