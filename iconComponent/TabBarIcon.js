import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import MaterialIcons

const TabBarIcon = ({ name }) => {
  return (
    <View style={styles.iconContainer}>
      <Icon name={name} size={24} color="#000" /> {/* Use the Icon component */}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBarIcon;