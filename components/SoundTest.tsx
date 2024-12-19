import React from 'react';
import { View } from 'react-native';
import VideoPlayer from 'react-native-video';
import * as FileSystem from "expo-file-system";

const SoundTest = () => {
  return (
    <View>
      <VideoPlayer
        source={{ uri:  "file://" +
            FileSystem.documentDirectory +
            "/Jonah 1-2 2/audioVisual/Jona 1 1-2.mp3" }}
        style={{ height: 0, width: 0 }} // Hide the video player
        paused={false} // Start playing immediately
        muted={false} // Unmute the audio
        resizeMode="cover" // Adjust video scaling
      />
    </View>
  );
};

export default SoundTest;