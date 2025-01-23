import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Alert, ScrollView, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = (props) => {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedFullname = await AsyncStorage.getItem('user_fullname');
      const storedUsername = await AsyncStorage.getItem('user_id');
      if (storedFullname) setFullname(storedFullname);
      if (storedUsername) setUsername(storedUsername);
    };

    fetchData();
  }, []);

  const settingBtnClicked = () => {
    console.log("Settings");
    // You can navigate to the settings screen if needed
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
    <SafeAreaView style={stylesSidebar.sideMenuContainer}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={stylesSidebar.profileHeader}>
          <View style={stylesSidebar.profileHeaderPicCircle}>
            <Text style={{ fontSize: 25, color: '#307ecc' }}>
              {fullname.charAt(0)}
            </Text>
          </View>

          <View style={stylesSidebar.profileHeaderItems}>
            <Text style={stylesSidebar.profileHeaderText}>
              {fullname}
              {"\n"}
            </Text>
            <Text style={stylesSidebar.profileHeaderText}>
              {username}
              {"\n"}
            </Text>
            <Text style={stylesSidebar.profileHeaderText}>
              Active Status: Online
            </Text>
          </View>
        </View>
        <View style={stylesSidebar.profileHeaderLine} />
        
        <TouchableOpacity style={stylesSidebar.settingStyle} onPress={settingBtnClicked}>
          <Text style={stylesSidebar.settingText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={stylesSidebar.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Button 
          title="Settings" 
          onPress={settingBtnClicked} 
          color="#FFD000" // You can set the button color
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const stylesSidebar = StyleSheet.create({
  sideMenuContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 0,
  },
  profileHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    padding: 15,
    textAlign: 'center',
    borderRadius: 3,
  },
  profileHeaderPicCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeaderItems: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  profileHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileHeaderLine: {
    height: 2,
    backgroundColor: '#FFD000',
    marginHorizontal: 10,
    marginTop: 5,
  },
  logoutText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  settingStyle: {
    backgroundColor: "#FFD000",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  settingText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});