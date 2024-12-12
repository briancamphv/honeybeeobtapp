import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { Audio,AVPlaybackStatus } from 'expo-av';
// const [duration, setDuration] = useState<number | null>(null);
// const [position, setPosition] = useState<number | undefined>(undefined);

var audioUri:string = "";


interface RecordingState {
  recording: Audio.Recording | null;
  message: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<RecordingState>({
    recording: null,
    message: '',
  });

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
    //   setDuration(status.durationMillis || 0);
    //   setPosition(status.positionMillis || 0);
    }
  };

//   useEffect(() => {
//     (async () => {
//       const permission = await Audio.requestPermissionsAsync();
//       if (permission.status !== 'granted') {
//         setState({ ...state, message: 'Please grant permission to app to access microphone' });
//       }
//     })();
//   }, [state]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setState({ ...state, recording });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (state.recording) {
      await state.recording.stopAndUnloadAsync();
      const uri = state.recording.getURI();
     
      console.log('Recording stopped and stored at', uri);
      loadSound(uri);
      setState({ ...state, recording: null });
    }
  };

  const playSound = async () => {

    console.log("sound",sound)
    if (!sound) return;

    
      await sound.playAsync();
    
  };

  const loadSound = async (audioUri:any) => {
    console.log("loadSound", audioUri)
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      console.log("newSound",newSound)
      setSound(newSound);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{state.message}</Text>
      <Button title="Start Recording" onPress={startRecording} disabled={!!state.recording} />
      <Button title="Stop Recording" onPress={stopRecording} disabled={!state.recording} />
      <Button title="Play Recording" onPress={playSound} disabled={!!state.recording} />
    </View>
  );
};

export default App;