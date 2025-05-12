import { StatusBar } from 'expo-status-bar';
import AppNavigator from 'components/Tabs';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
