import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, ScrollView, TouchableOpacity, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, PORT } from '@env';

const ProfileScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [backgroundColor, setBackgroundColor] = useState();
  const [profileHeaderPicCircleColor, setProfileHeaderPicCircleColor] = useState();
  const [themeMode, setThemeMode] = useState();
  const [isEnabled, setIsEnabled] = useState();

  const fetchProfileData = async () => {
    const storedUsername = await AsyncStorage.getItem('user_id');
    let dataToSend = { email: storedUsername };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(API_URL + ":" + PORT + '/fetchUserInfo', {
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
          if (responseJson.data.email) setUsername(responseJson.data.email);
          if (responseJson.data.firstName) setFirstName(responseJson.data.firstName);
          if (responseJson.data.middleName) setMiddleName(responseJson.data.middleName);
          if (responseJson.data.lastName) setLastName(responseJson.data.lastName);
        } else {
          console.error(responseJson.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProfileData();
      const storedThemeMode = await AsyncStorage.getItem('user_themeMode');
      let isDarkMode;
      if (storedThemeMode === "Dark") {
        setThemeMode("Dark")
        isDarkMode = true;
        setIsEnabled(true);
      }
      else {
        setThemeMode("White")
        isDarkMode = false;
        setIsEnabled(false);
      }
      const bgColor = isDarkMode ? '#000000' : '#ffffff';
      const profileColor = isDarkMode ? '#ffffff' : '#000000';
      setBackgroundColor(bgColor);
      setProfileHeaderPicCircleColor(profileColor);

    };
    fetchData();
  }, []);


  const updateThemeModeInDB = async () => {
    let newThemeMode;
    if (themeMode === "White") {
      newThemeMode = "Dark";
    }
    else {
      newThemeMode = "White";
    }
    const storedUsername = await AsyncStorage.getItem('user_id');
    let dataToSend = {
      email: storedUsername,
      themeMode: newThemeMode
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    fetch(API_URL + ":" + PORT + '/updateThemeModeInDB', {
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

        } else {
          console.error(responseJson.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const settingBtnClicked = () => {
    props.navigation.navigate('SettingsScreen');
  };

  const handleColorChange = (bgColor, profileColor) => {
    if (themeMode === "White") {
      setThemeMode("Dark");
      AsyncStorage.setItem('user_themeMode', "Dark");
    } else {
      setThemeMode("White");
      AsyncStorage.setItem('user_themeMode', "White");
    }
    updateThemeModeInDB();
    setIsEnabled(previousState => !previousState)
    setBackgroundColor(bgColor);
    setProfileHeaderPicCircleColor(profileColor);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure? You want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.clear();
            props.navigation.replace('Auth');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={[styles.sideMenuContainer, { backgroundColor }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.profileHeader}>
          <View style={[styles.profileHeaderPicCircle, { backgroundColor: profileHeaderPicCircleColor }]}>
            <Text style={{ fontSize: 25, color: backgroundColor }}>
              {firstName.charAt(0)}{lastName.charAt(0)}
            </Text>
          </View>

          <View style={styles.profileHeaderItems}>
            <Text style={[styles.profileHeaderText, { color: profileHeaderPicCircleColor }]}>
              {firstName} {middleName.charAt(0)}. {lastName}
              {"\n"}
            </Text>
            <Text style={[styles.profileHeaderText, { color: profileHeaderPicCircleColor }]}>
              {username}
              {"\n"}
            </Text>
            <Text style={[styles.profileHeaderText, { color: profileHeaderPicCircleColor }]}>
              Active Status: Online
            </Text>
          </View>
        </View>

        <View style={styles.profileHeaderLine} />

        <View style={styles.profileBody}>
          <TouchableOpacity style={styles.settingStyle} onPress={settingBtnClicked}>
            <Text style={styles.textStyle}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingStyle} onPress={handleLogout}>
            <Text style={styles.textStyle}>Logout</Text>
          </TouchableOpacity>

          <View style={[styles.settingStyle, styles.switchButton]}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              // onValueChange={ isEnabled ? handleColorChange('#000000') : handleColorChange('#ffffff')}

              onValueChange={() => {
                const bgColor = !isEnabled ? '#000000' : '#ffffff';
                const profileColor = !isEnabled ? '#ffffff' : '#000000';
                handleColorChange(bgColor, profileColor);
              }}
              value={isEnabled}
            />
            <Text style={styles.textStyle}>{isEnabled ? 'Dark Mode: On' : 'Dark Mode: Off'}</Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  sideMenuContainer: {
    flex: 1,
    paddingTop: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 10,
    textAlign: 'center',
    borderRadius: 3,
  },
  profileHeaderPicCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileHeaderItems: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  profileHeaderText: {
    color: 'white',
    fontWeight: 600,
    fontSize: 16,
  },
  profileHeaderLine: {
    height: 2,
    backgroundColor: '#FFD000',
    marginHorizontal: 10,
    marginTop: 5,
  },
  settingStyle: {
    backgroundColor: "#FFD000",
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 2,
    height: 30,
  },
  textStyle: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 600,
    fontSize: 16,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBody: {
    padding: 5,
    margin: 5,
  }
});