import * as React from "react";

import { StyleSheet, View } from "react-native";

import {
  Appbar,
  List,
  IconButton,
  Dialog,
  Portal,
  Button,
  Text,
  Icon,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { useState, useRef } from "react";

interface RecordingState {
  recording: Audio.Recording | null;
  message: string;
}

const HBRecordBar: React.FC = () => {
  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

  const navigation = useNavigation();

  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);

  const recordingRef = useRef(null);

  const [state, setState] = useState<RecordingState>({
    recording: null,
    message: "",
  });

  const [duration, setDuration] = useState<number | null>(null);
  const [position, setPosition] = useState<number | undefined>(undefined);
  const [playing, setPlaying] = useState<boolean>(false);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      if (status.positionMillis === status.durationMillis) {
        sound?.setPositionAsync(0);
      }
    }
  };

  const startRecording = async () => {
    try {
      setState({ ...state, recording: null });
      setIsRecording(true);
      console.log("startRecording");
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
      console.error("Failed to start recording", err);
    }
  };
  const stopRecording = async () => {
    if (state.recording) {
      await state.recording.stopAndUnloadAsync();
      const uri = state.recording.getURI();

      console.log("Recording stopped and stored at", uri);
      loadSound(uri);
      setState({ ...state, recording: null });
      setIsRecording(false);
      setPlaying(false);
    }
  };

  const loadSound = async (audioUri: any) => {
    if (sound) {
      await sound.unloadAsync();
    }

    console.log("loadSound", audioUri);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      console.log("newSound", newSound);
      setSound(newSound);
    } catch (error) {
      console.error("Failed to load sound", error);
    }
  };

  // const playSound = async () => {
  //   console.log("sound", sound);
  //   if (!sound) {
  //     console.log("no sound");
  //     return;
  //   }

  //   await sound.playAsync();
  //   //reset to beginning
  //   sound.setPositionAsync(0);
  // };

  const replay = async () => {
    setPlaying(true);
    sound?.setPositionAsync(0);
  };

  const playPauseSound = async () => {
    if (!sound) return;

    if (playing) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setPlaying(!playing);
  };

  const openRecordingFolder = () => {
    console.log("open folder");
  };

  return (
    <>
      <Appbar.Header elevated={true} style={styles.title}>
        <Appbar.Action
          icon={isRecording ? "stop" : "record"}
          size={30}
          color="white"
          onPress={isRecording ? stopRecording : startRecording}
        />

        <Appbar.Action
          icon={playing ? "pause" : "play"}
          size={30}
          color="white"
          onPress={playPauseSound}
        />

        <Appbar.Action icon="replay" size={30} color="white" onPress={replay} />

        <Appbar.Action
          icon="folder-edit-outline"
          size={30}
          color="white"
          onPress={openRecordingFolder}
        />
      </Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "blue",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 5,
  },

  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HBRecordBar;
