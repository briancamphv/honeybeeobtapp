import * as React from "react";

import { StyleSheet, View, Dimensions, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";

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

import { useState, useRef, useEffect } from "react";

import { copyAndWriteFile, listFiles, deleteFile } from "@/helpers/FileUtilies";

import audioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";

// interface RecordingState {
//   recording: Audio.Recording | null;
//   message: string;
// }

const { width: screenWidth } = Dimensions.get("screen");

const audioRecorder = new audioRecorderPlayer();

const HBRecordBar: React.FC = () => {
  const {
    disableAudio,
    isPlayRecording,
    isNotPlayRecording,
    template,
    translationStep,
    title,
    language,
  } = useAppContext();

  

  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);

  const recordingRef = useRef(null);

  //const [currentPosition, setCurrentPosition] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);

  // const [duration, setDuration] = useState<number | null>(null);
  // const [position, setPosition] = useState<number | undefined>(undefined);
  const [playing, setPlaying] = useState<boolean>(false);

  const recordDir =
    FileSystem.documentDirectory! +
    template +
    "/" +
    title +
    "/" +
    translationStep +
    "/";

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [draftRecordings, setDraftRecordings] = useState<string[]>([]);


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

  const playDraftRecording = async (item: string) => {
    var playFile = recordDir + item;

    audioRecorder.startPlayer(playFile);
  };

  const deleteDraftRecording = async (item: string) => {
    var playFile = recordDir + item;

    var newList = draftRecordings.filter((item) => item !== playFile)

    setDraftRecordings((prevItems) => prevItems.filter((item) => item !== item))

    deleteFile(playFile);
  };

  const onStopRecord = async () => {
    setIsRecording(false);

    const result = await audioRecorder.stopRecorder();

    var files = await listFiles(recordDir);

    var destFile = recordDir + "draftv" + (files.length + 1) + ".mp4";

    await copyAndWriteFile(result, destFile, () => null);

    console.log("record file", result, destFile);

    setAudioUri(result);
    setHasStarted(false);
  };

  const onStartPlay = async () => {
    isPlayRecording();

    console.log("audioURI", audioURI);

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

  const [draftRecordsDialogVisible, setDraftRecordsDialogVisible] =
    useState<boolean>(false);

  const openDraftRecordsDialog = () => {
    listFiles(recordDir).then((list) => setDraftRecordings(list));

    setDraftRecordsDialogVisible(true);
  };

  const closeDraftRecordsDialog = () => {
    setDraftRecordsDialogVisible(false);
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
    openDraftRecordsDialog();
  };

  return (
    <>
      <Appbar.Header elevated={true} style={styles.title}>
        <Appbar.Content title="Recording" color="white" />
        <Appbar.Action
          icon={isRecording ? "stop" : "microphone"}
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

      <Portal>
        <Dialog
          style={{ width: screenWidth - 50 }}
          visible={draftRecordsDialogVisible}
          onDismiss={closeDraftRecordsDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>{t("Recordings", {lng: language})}:</Dialog.Title>

          <Dialog.Content>
            {draftRecordings.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: screenWidth - 100,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    key={index}
                    onPress={() => playDraftRecording(item)}
                  >
                    <Icon color="black" source="play" size={25} />
                  </TouchableOpacity>

                  <Text style={styles.dialogContent}>{item}</Text>

                  <TouchableOpacity
                    key={index + 100}
                    onPress={() => deleteDraftRecording(item)}
                  >
                    <Icon color="red" source="delete" size={25} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={closeDraftRecordsDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "blue",
    justifyContent: "space-between",
    height: 50,
    marginBottom: 5,
    color: "white",
  },

  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  dialogContent: {
    fontSize: 12,
  },

  dialogTitle: {
    fontSize: 16,
  },
});

export default HBRecordBar;
