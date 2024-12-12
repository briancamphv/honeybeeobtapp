import React, { useState, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon, ProgressBar, MD3Colors } from "react-native-paper"; // Adjust this import according to your UI component needs
import { Audio, AVPlaybackStatus } from "expo-av";
import Slider from "@react-native-community/slider"; // Install this with 'npm install @react-native-community/slider'

interface AudioPlayerProps {
  audioUri: string;
}

const HBAudioPlayer: React.FC<AudioPlayerProps> = ({ audioUri }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      // Cleanup function to unload sound
      sound?.unloadAsync();
    };
  }, [sound]);

  const playPauseSound = async () => {
    if (!sound) return;

    if (playing) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setPlaying(!playing);
  };

  const loadSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
    }
  };

  const handleSliderValueChange = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  useEffect(() => {
    console.log("loadsound", audioUri);
    loadSound();
  }, [audioUri]);

  return (
    <View style={{ padding: "10", flexDirection: "row", width: "90%" }}>
      <TouchableOpacity disabled={!sound} onPress={playPauseSound}>
        <Icon
          source={playing ? "pause" : "play"}
          color={MD3Colors.error50}
          size={35}
        />
      </TouchableOpacity>

      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={duration || 0}
        value={position || 0}
        onValueChange={handleSliderValueChange}
        disabled={!sound}
      />
    </View>
  );
};

export default HBAudioPlayer;
