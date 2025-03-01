import React, { useState, createRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Components/Loader';
import { API_URL, PORT } from '@env';


import { IconButton, MD3Colors } from 'react-native-paper';

const EditPersonalInfoScreen = (props) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const passwordInputRef = createRef();

  useEffect(() => {
    const fetchPersonalData = async () => {
      const storedUsername = await AsyncStorage.getItem('user_id');
      setLoading(true);

      let dataToSend = { email: storedUsername };
      let formBody = [];
      for (let key in dataToSend) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }

      formBody = formBody.join('&');

      fetch(API_URL + ":" + PORT + '/fetchPersonalInfo', {
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
            if (responseJson.data.email) setEmail(responseJson.data.email);
            if (responseJson.data.firstName) setFirstName(responseJson.data.firstName);
            if (responseJson.data.middleName) setMiddleName(responseJson.data.middleName);
            if (responseJson.data.lastName) setLastName(responseJson.data.lastName);
          } else {
            setErrortext(responseJson.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    };
    fetchPersonalData();
  }, []);

  const handleUpdatePress = async () => {
    setErrortext('');

    if (!email) {
      alert('Please fill Email');
      return;
    }
    if (!firstName) {
      alert('Please fill First Name');
      return;
    }
    if (!lastName) {
      alert('Please fill Last Name');
      return;
    }

    setLoading(true);

    let dataToSend = { email: email, firstName: firstName, middleName: middleName, lastName: lastName };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }

    formBody = formBody.join('&');

    fetch(API_URL + ":" + PORT + '/updatePersonalInfo', {
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
          setIsUpdateSuccess(true);
        } else {
          setErrortext(responseJson.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  if (isUpdateSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#00000066', // Semi-transparent background
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '80%', // Adjust size as needed
            backgroundColor: '#ffffff',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
            // shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            // shadowOpacity: 0.3,
            // shadowRadius: 4,
            elevation: 5, // For Android shadow
          }}>
          <Image
            source={require('../../image/success.png')}
            style={{
              height: 100, // Adjusted height for a smaller box
              resizeMode: 'contain',
              marginBottom: 5, // Space between image and text
            }}
          />
          <Text style={styles.successTextStyle}>
            Data Updated Successfully
          </Text>
          <TouchableOpacity
            style={[styles.topupButtonStyle, styles.buttonStyle]}
            activeOpacity={0.5}
            onPress={() => setIsUpdateSuccess(false)}>
            <Text style={styles.buttonTextStyle}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
              if (props.navigation.canGoBack()) {
                props.navigation.goBack();
              } else {
                alert("No previous screen to go back to");
              }
            }
            }>
          </IconButton>
        </View>
        <Text style={styles.headerText}>Edit Personal Info</Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
        }}
      >
        <View>
          <KeyboardAvoidingView enabled>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(email) => setEmail(email)}
                placeholder="Email"
                value={email}
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(firstName) => setFirstName(firstName)}
                underlineColorAndroid="#f000"
                placeholder="First Name"
                value={firstName}
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  firstNameInputRef.current && firstNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(middleName) => setMiddleName(middleName)}
                underlineColorAndroid="#f000"
                placeholder="Middle Name"
                value={middleName}
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  middleNameInputRef.current && middleNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(lastName) => setLastName(lastName)}
                underlineColorAndroid="#f000"
                placeholder="Last Name"
                value={lastName}
                placeholderTextColor="#8b9cb5"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  lastNameInputRef.current && lastNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleUpdatePress}
            >
              <Text style={styles.buttonTextStyle}>Update</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View >
  );
};

export default EditPersonalInfoScreen;

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
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#FFD000',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    margin: 15,
  },
  topupButtonStyle: {
    width: 100,
  },
  buttonTextStyle: {
    color: '#000000',
    padding: 10,
    fontSize: 16,
    fontWeight: 600,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#ffffff',
    fontWeight: 600,
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  successTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },  
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});