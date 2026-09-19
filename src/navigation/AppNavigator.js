import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SheltersScreen from '../screens/SheltersScreen';
import CheckInScreen from '../screens/CheckInScreen';
import MyCheckInsScreen from '../screens/MyCheckInsScreen';
import MapScreen from '../screens/MapScreen';
import ShelterDetailScreen from '../screens/ShelterDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Shelters" component={SheltersScreen} />
        <Stack.Screen name="Check In" component={CheckInScreen} />
        <Stack.Screen name="My Check-ins" component={MyCheckInsScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Shelter Detail" component={ShelterDetailScreen} options={{ title: 'Shelter Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}