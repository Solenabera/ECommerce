import * as React from 'react';
import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../Screen/drawerScreens/HomeScreen';
import SettingsScreen from '../Screen/drawerScreens/SettingsScreen';
import ProfileScreen from './drawerScreens/ProfileScreen';

import { API_URL, PORT } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const homeName = "Home";
const profilesName = "Profiles";
const settingsName = "Settings";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {

  const fetchThemeMode = async () => {
    const storedUsername = await AsyncStorage.getItem('user_id');

    let dataToSend = { email: storedUsername };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');

    fetch(API_URL + ":" + PORT + '/fetchThemeMode', {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === 'success') {
          if (responseJson.data.themeMode) {
            AsyncStorage.setItem('user_themeMode', responseJson.data.themeMode);
          }
          else {
            AsyncStorage.setItem('user_themeMode', "White");
          }
        } else {
          console.error(responseJson.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchThemeMode();
  }, []);

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