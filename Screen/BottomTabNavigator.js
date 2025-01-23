import * as React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


import HomeScreen from '../Screen/drawerScreens/HomeScreen';
import SettingsScreen from '../Screen/drawerScreens/SettingsScreen';
import ProfileScreen from '../Screen/drawerScreens/Profile';

const homeName = "Home";
const profilesName = "Profiles";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';

          } else if (rn === profilesName) {
            iconName = focused ? 'person-circle' : 'person-circle-outline';

          } else if (rn === settingsName) {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}

      tabBarOptions={{
        showLabel: false,
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
        labelStyle: { paddingBottom: 10, fontSize: 10 },
        style: { padding: 5, height: 40 }
      }}>

      <Tab.Screen
        name={homeName}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={settingsName}
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={profilesName}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />

    </Tab.Navigator>
  );
}

export default BottomTabNavigator;