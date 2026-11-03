import React from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  Button
} from 'react-native';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import {
  AppProvider,
  useAppContext
} from './context/AppContext';

import AuthScreen from './screens/AuthScreen';
import BookingsScreen from './screens/BookingsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function AppContent() {

  const {
    user,
    loading
  } = useAppContext();

  // Wait for Firebase to check the session
  if (loading) {

    return (

      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <ActivityIndicator size="large" />

        <Text>Checking authentication...</Text>

      </View>

    );

  }

  // Signed-out users see the authentication screen
  if (!user) {

    return <AuthScreen />;

  }

  // Signed-in users see protected screens
  return (

    <NavigationContainer>

      <Stack.Navigator initialRouteName="Bookings">

        <Stack.Screen
          name="Bookings"
          component={BookingsScreen}
          options={({ navigation }) => ({
            title: 'My Clinic Bookings',
            headerRight: () => (
              <Button
                title="Profile"
                onPress={() => navigation.navigate('Profile')}
              />
            )
          })}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Patient Profile'
          }}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );

}

export default function App() {

  return (

    <AppProvider>

      <AppContent />

    </AppProvider>

  );

}