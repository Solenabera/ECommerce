import React, { useState, createRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Components/Loader';
import { API_URL } from '@env';


import { IconButton, MD3Colors } from 'react-native-paper';
import { FormLabel } from '@mui/material';

const SettingsScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  const handleSubmitPress = async () => {
    setErrortext('');

    if (!email) {
      alert('Please fill Email');
      return;
    }
    if (!password) {
      alert('Please fill Password');
      return;
    }

    setLoading(true);

    let dataToSend = { email: email, password: password };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');

    fetch(`http://192.168.221.132:5000/login_user`, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        if (responseJson.status === 'success') {
          AsyncStorage.setItem('user_id', responseJson.data.email);
          AsyncStorage.setItem('user_fullname', responseJson.data.fullname);
          navigation.replace('BottomTabNavigator');
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <View style={styles.headerGeneral}>
        <View style={styles.header}>
          <IconButton
            style={styles.backButton}
            icon="chevron-left"
            iconColor="#000000"
            size={25}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                alert("No previous screen to go back to");
              }
            }
            }>
          </IconButton>
        </View>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          alignContent: 'center',
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('EditPersonalInfoScreen')}
            >
              <Text style={styles.buttonTextStyle}>Edit Personal Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('ChangePasswordScreen')}
            >
              <Text style={styles.buttonTextStyle}>Change Password</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
    alignContent: 'center',
  },
  headerGeneral: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#007800'
  },
  header: {
    position: 'relative',
    padding: 1,
    zIndex: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 600,
  },
  backButton: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    fontWeight: 600,
  },
  backButtonText: {
    color: '#307ecc',
    fontSize: 20,
  },
  buttonStyle: {
    backgroundColor: '#FFD000',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#7DE24E',
    height: 30,
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 5,
    margin: 2,
    padding: 5,
  },

  buttonTextStyle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 600,
  },
});