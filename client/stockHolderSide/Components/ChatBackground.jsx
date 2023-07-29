import React from 'react';
import { StyleSheet, View } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const ChatBackground = ({ children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0FFF0','#F0FFF0','#ffffff','#ffffff']}
        style={styles.gradient}>
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%'
  },
  gradient: {
    flex: 1,
    height:'100%'

  },
});

export default ChatBackground;