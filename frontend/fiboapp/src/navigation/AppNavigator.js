import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import SplashScreen from '../api/screens/SplashScreen';
import WelcomeScreen from '../api/screens/WelcomeScreen';
import RegisterScreen from '../api/screens/RegisterScreen';
import PinScreen from '../api/screens/PinScreen';
import DashboardScreen from '../api/screens/DashboardScreen';
import SendChangeScreen from '../api/screens/SendChangeScreen';
import ConfirmScreen from '../api/screens/ConfirmScreen';
import DoneScreen from '../api/screens/DoneScreen';
import TransactionsScreen from '../api/screens/TransactionsScreen';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarStyle: { paddingBottom: 10 } }}>
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarIcon: () => <Text>🏠</Text>, tabBarLabel: '' }} />
      <Tab.Screen name="Send" component={SendChangeScreen} options={{ tabBarIcon: () => <Text>➤</Text>, tabBarLabel: '' }} />
      <Tab.Screen name="History" component={TransactionsScreen} options={{ tabBarIcon: () => <Text>🕐</Text>, tabBarLabel: '' }} />
      <Tab.Screen name="Profile" component={DashboardScreen} options={{ tabBarIcon: () => <Text>👤</Text>, tabBarLabel: '' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={RegisterScreen} />
            <Stack.Screen name="Pin" component={PinScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="SendChange" component={SendChangeScreen} />
            <Stack.Screen name="Confirm" component={ConfirmScreen} />
            <Stack.Screen name="Done" component={DoneScreen} />
            <Stack.Screen name="Transactions" component={TransactionsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}