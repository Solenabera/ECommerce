import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const SettingsScreen = () => {
  const [backgroundColor, setBackgroundColor] = useState();
  const [textColor, setTextColor] = useState();

  const fetchThemeMode = async () => {
    const storedThemeMode = await AsyncStorage.getItem('user_themeMode');
    const isDarkMode = storedThemeMode === "Dark";
    const bgColor = isDarkMode ? '#000000' : '#ffffff';
    const txtColor = isDarkMode ? '#ffffff' : '#000000';
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchThemeMode();
    }, [])
  );

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor }]}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
              color: textColor,
            }}>
            Setting
            {'\n\n'}
            Page
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;