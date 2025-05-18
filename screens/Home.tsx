import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Welcome Back, Mert</Text>
            <Text className="text-sm text-gray-500">MMA Training Program - Day 14</Text>
          </View>
          <TouchableOpacity className="p-2 bg-white rounded-full shadow-sm">
            <Ionicons name="notifications-outline" size={24} color="#4b5563" />
          </TouchableOpacity> 
        </View>

        {/* Quick Stats Row */}
        <View className="flex-row justify-between mb-6">
          <StatCard icon="fire" title="Calories" value="1,840/2,100" color="#f59e0b" />
          <StatCard icon="water" title="Hydration" value="2.1L" color="#3b82f6" />
          <StatCard icon="speedometer" title="Progress" value="82%" color="#10b981" />
        </View>

        {/* Main Actions */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity 
            className="bg-[#8A47EB] p-4 flex-1 mr-3 rounded-xl items-center"
            onPress={() => navigation.navigate('FirstMealForm')}
          >
            <Text className="text-white font-semibold text-lg">Create New Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white p-4 flex-1 ml-3 rounded-xl items-center shadow-sm">
            <Text className="text-[#8A47EB] font-semibold text-lg">Current Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Meal Plan */}
        <SectionHeader 
          title="Today's Nutrition Plan" 
          action="View All" 
          icon="food-apple"
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <MealItem time="7:30 AM" name="MMA Fuel Breakfast" macros="42P • 58C • 18F" />
          <MealItem time="10:30 AM" name="Pre-Training Snack" macros="28P • 42C • 12F" />
          <MealItem time="1:30 PM" name="Recovery Lunch" macros="52P • 48C • 22F" />
          <TouchableOpacity className="items-center mt-3">
            <Text className="text-[#8A47EB] font-medium">Add Custom Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Grocery List */}
        <SectionHeader
          title="Grocery List" 
          action="Export" 
          icon="cart"
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <GroceryItem name="Chicken Breast" quantity="1.4kg" />
          <GroceryItem name="Quinoa" quantity="600g" swapable />
          <GroceryItem name="Spinach" quantity="300g" />
          <TouchableOpacity className="flex-row items-center mt-3">
            <FontAwesome5 name="camera" size={16} color="#8A47EB" />
            <Text className="text-[#8A47EB] font-medium ml-2">Scan to Add Items</Text>
          </TouchableOpacity>
        </View>

        {/* AI Coaching Section */}
        <SectionHeader 
          title="AI Nutrition Coach" 
          action="Chat" 
          icon="robot"
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <AICoachButton 
            title="Optimize Restaurant Order" 
            subtitle="Chipotle menu analyzed"
          />
          <AICoachButton 
            title="Quick Meal Prep Ideas" 
            subtitle="5-ingredient recipes"
          />
          <AICoachButton 
            title="Supplement Advice" 
            subtitle="Pre-workout recommendations"
          />
        </View>

        {/* Progress Tracking */}
        <SectionHeader 
          title="Weekly Progress" 
          action="Details" 
          icon="chart-areaspline"
        />
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <ProgressCircle percentage={78} label="Muscle Gain" color="#8A47EB" />
            <ProgressCircle percentage={65} label="Fat Loss" color="#10b981" />
            <ProgressCircle percentage={92} label="Recovery" color="#3b82f6" />
          </View>
          <Text className="text-center text-gray-600 text-sm">
            Projected weekly result: 0.6kg muscle gain • 0.4kg fat loss
          </Text>
        </View>
      </ScrollView>

      {/* Floating AI Assistant */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-[#8A47EB] p-4 rounded-full shadow-lg">
        <MaterialCommunityIcons name="robot" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Reusable Components
const SectionHeader = ({ title, action, icon }: any) => (
  <View className="flex-row justify-between items-center mb-4">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name={icon} size={20} color="#4b5563" />
      <Text className="text-lg font-semibold text-gray-900 ml-2">{title}</Text>
    </View>
    <TouchableOpacity className="flex-row items-center">
      <Text className="text-[#8A47EB] font-medium mr-2">{action}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8A47EB" />
    </TouchableOpacity>
  </View>
);

const MealItem = ({ time, name, macros }: any) => (
  <TouchableOpacity className="py-3 border-b border-gray-100 last:border-0">
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-gray-500 text-sm">{time}</Text>
        <Text className="font-medium text-gray-900">{name}</Text>
        <Text className="text-sm text-gray-500">{macros}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#4b5563" />
    </View>
  </TouchableOpacity>
);

const GroceryItem = ({ name, quantity, swapable }: any) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-0">
    <View>
      <Text className="font-medium text-gray-900">{name}</Text>
      <Text className="text-sm text-gray-500">{quantity}</Text>
    </View>
    {swapable ? (
      <TouchableOpacity className="flex-row items-center bg-[#F6F0FF] px-3 py-1 rounded-full">
        <Text className="text-[#8A47EB] text-sm mr-2">Swap</Text>
        <MaterialCommunityIcons name="swap-horizontal" size={16} color="#8A47EB" />
      </TouchableOpacity>
    ) : (
      <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
    )}
  </View>
);

const AICoachButton = ({ title, subtitle }: any) => (
  <TouchableOpacity className="py-3 border-b border-gray-100 last:border-0">
    <View>
      <Text className="font-medium text-gray-900">{title}</Text>
      <Text className="text-sm text-gray-500">{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const ProgressCircle = ({ percentage, label, color }: any) => (
  <View className="items-center">
    <View className="w-16 h-16 rounded-full border-4 border-gray-100 items-center justify-center">
      <Text style={{ color }} className="font-bold text-lg">{percentage}%</Text>
    </View>
    <Text className="text-sm text-gray-600 mt-2">{label}</Text>
  </View>
);

const StatCard = ({ icon, title, value, color }: any) => (
  <View className="bg-white p-4 rounded-xl flex-1 mx-1 shadow-sm">
    <MaterialCommunityIcons name={icon} size={20} color={color} />
    <Text className="text-sm text-gray-500 mt-2">{title}</Text>
    <Text className="text-lg font-semibold text-gray-900">{value}</Text>
  </View>
);

export default HomeScreen;
