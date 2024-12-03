import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { Audio } from "expo-av";

const HBAudioPlayer = ({ recording }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = useRef(new Audio.Sound());

  const playSound = async () => {
    try {
      await sound.current.loadAsync(recording.uri);
      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const stopSound = async () => {
    try {
      await sound.current.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
  };

  useEffect(() => {
    return () => {
      sound.current.unloadAsync();
    };
  }, []);

  return (
    <View>
      <Button mode="contained" onPress={isPlaying ? stopSound : playSound}>
        {isPlaying ? "Stop Playing" : "Play Recording"}
      </Button>
    </View>
  );
};

export default HBAudioPlayer;
