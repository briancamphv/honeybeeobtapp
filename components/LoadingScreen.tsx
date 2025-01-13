import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { ActivityIndicator } from 'react-native-paper';

interface props {
    screen: string,
    waitTime: number
}

const LoadingScreen: React.FC<props> = ({ screen, waitTime=2000 }) => {
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, waitTime); // Wait for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" animating={true} /> 
      </View>
    );
  } else {
    // Navigate to the next screen after the waiting period
    navigation.dispatch(DrawerActions.jumpTo("ScripturePager"));
    return null; // Prevent the loading screen from being rendered after navigation
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
  },
});

export default LoadingScreen;