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

import { useAppContext } from "@/context/AppContext";

import { useState, useRef } from "react";

import audioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";

// interface RecordingState {
//   recording: Audio.Recording | null;
//   message: string;
// }

const audioRecorder = new audioRecorderPlayer();

const HBRecordBar: React.FC = () => {
  const { disableAudio, isPlayRecording, isNotPlayRecording } = useAppContext();

  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);

  const recordingRef = useRef(null);

  //const [currentPosition, setCurrentPosition] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);

  // const [duration, setDuration] = useState<number | null>(null);
  // const [position, setPosition] = useState<number | undefined>(undefined);
  const [playing, setPlaying] = useState<boolean>(false);

  const [hasStarted, setHasStarted] = useState<boolean>(false);

  const [audioURI, setAudioUri] = useState<string>("");

  //const [sound, setSound] = useState<Audio.Sound | null>(null);

  audioRecorder.addPlayBackListener((status) => onPlaybackStatusUpdate(status));

  const onPlaybackStatusUpdate = (status: PlayBackType) => {
    // setDuration(status.duration || 0);
    // setCurrentPosition(status.currentPosition || 0);

    if (status.isFinished) {
      setAudioLoaded(false);
      setPlaying(false);
      isNotPlayRecording();
      // setCurrentPosition(0);
    }
  };

  const onStartRecord = async () => {
    disableAudio();

    setIsRecording(true);
    setPlaying(false);
    const result = await audioRecorder.startRecorder();
  };

  const onStopRecord = async () => {
    setIsRecording(false);

    const result = await audioRecorder.stopRecorder();

    setAudioUri(result);
    setHasStarted(false);
  };

  const onStartPlay = async () => {
    isPlayRecording();

    const msg = await audioRecorder.startPlayer(audioURI);
    setPlaying(true);
  };

  const onPausePlay = async () => {
    if (hasStarted) {
      if (playing) {
        setPlaying(false);
        isNotPlayRecording();
        await audioRecorder.pausePlayer();
      } else {
        isNotPlayRecording();
        await audioRecorder.resumePlayer();
      }
    } else {
      setHasStarted(true);
      onStartPlay();
    }
  };

  const onStopPlay = async () => {
    audioRecorder.stopPlayer();
  };

  // const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
  //   if (status.isLoaded) {
  //     setDuration(status.durationMillis || 0);
  //     setPosition(status.positionMillis || 0);
  //     if (status.positionMillis === status.durationMillis) {
  //       sound?.setPositionAsync(0);
  //     }
  //   }
  // };

  // const startRecording = async () => {
  //   try {
  //     setState({ ...state, recording: null });
  //     setIsRecording(true);
  //     console.log("startRecording");
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY
  //     );
  //     setState({ ...state, recording });
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //   }
  // };
  // const stopRecording = async () => {
  //   if (state.recording) {
  //     await state.recording.stopAndUnloadAsync();
  //     const uri = state.recording.getURI();

  //     console.log("Recording stopped and stored at", uri);
  //     loadSound(uri);
  //     setState({ ...state, recording: null });
  //     setIsRecording(false);
  //     setPlaying(false);
  //   }
  // };

  // const loadSound = async (audioUri: any) => {
  //   if (sound) {
  //     await sound.unloadAsync();
  //   }

  //   console.log("loadSound", audioUri);
  //   try {
  //     const { sound: newSound } = await Audio.Sound.createAsync(
  //       { uri: audioUri },
  //       { shouldPlay: false },
  //       onPlaybackStatusUpdate
  //     );
  //     console.log("newSound", newSound);
  //     setSound(newSound);
  //   } catch (error) {
  //     console.error("Failed to load sound", error);
  //   }
  // };

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

  // const replay = async () => {
  //   setPlaying(true);
  //   sound?.setPositionAsync(0);
  // };

  // const playPauseSound = async () => {
  //   if (!sound) return;

  //   if (playing) {
  //     await sound.pauseAsync();
  //   } else {
  //     await sound.playAsync();
  //   }
  //   setPlaying(!playing);
  // };

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
          onPress={isRecording ? onStopRecord : onStartRecord}
        />

        <Appbar.Action
          icon={playing ? "pause" : "play"}
          size={30}
          color="white"
          onPress={onPausePlay}
        />

        <Appbar.Action
          icon="replay"
          size={30}
          color="white"
          onPress={onStartPlay}
        />

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
