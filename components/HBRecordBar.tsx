import * as React from "react";

import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import stripWordsofSpecialCharacters from "@/helpers/StringFunctions";

import { Dialog, Portal, Button, Text, Icon } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { useAppContext } from "@/context/AppContext";

import { useState, useRef } from "react";

import {
  copyAndWriteFile,
  listFiles,
  deleteFile,
  createDirectory,
} from "@/helpers/FileUtilies";

import { PlayBackType } from "react-native-audio-recorder-player";

// interface RecordingState {
//   recording: Audio.Recording | null;
//   message: string;
// }

const { width: screenWidth } = Dimensions.get("screen");

const HBRecordBar: React.FC = () => {
  const {
    disableAudio,
    isPlayRecording,
    isNotPlayRecording,
    audioPlayer,
    template,
    translationStep,
    title,
    language,
  } = useAppContext();

  const { t } = useTranslation();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingDraft, setIsPlayingDraft] = useState<boolean>(false);
  const [draftIndex, setDraftIndex] = useState<number>(-1);

  const recordingRef = useRef(null);

  const [playing, setPlaying] = useState<boolean>(false);

  const recordDir =
    FileSystem.documentDirectory! +
    template +
    "/" +
    stripWordsofSpecialCharacters(title, ":") +
    "/" +
    translationStep +
    "/";

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [draftRecordings, setDraftRecordings] = useState<string[]>([]);

  const [audioURI, setAudioUri] = useState<string>("");

  audioPlayer.removePlayBackListener();
  audioPlayer.addPlayBackListener((status) => onPlaybackStatusUpdate(status));

  const onPlaybackStatusUpdate = (status: PlayBackType) => {
    if (status.isFinished) {
      setPlaying(false);
      setHasStarted(false);
      isNotPlayRecording();
      setIsPlayingDraft(false);
      //audioPlayer.seekToPlayer(0)
      // setCurrentPosition(0);
    }
  };

  const onStartRecord = async () => {
    setIsRecording(true);
    setPlaying(false);
    disableAudio();
    const result = await audioPlayer.startRecorder();
  };

  const playDraftRecording = async (item: string, index: number) => {
    setDraftIndex(index);

    if (isPlayingDraft) {
      setIsPlayingDraft(false);
      isNotPlayRecording();
      audioPlayer.stopPlayer();
    } else {
      isPlayRecording();
      setIsPlayingDraft(true);
      var playFile = recordDir + item;

      disableAudio();

      setTimeout(() => {
        audioPlayer.addPlayBackListener((status) =>
          onPlaybackStatusUpdate(status)
        );
        audioPlayer.startPlayer(playFile);
      }, 5); // 1000 milliseconds = 1 second
    }
  };

  const deleteDraftRecording = async (item: string) => {
    var playFile = recordDir + item;

    setDraftRecordings((prevItems) =>
      prevItems.filter((entry) => entry !== item)
    );

    deleteFile(playFile);
  };

  const onStopRecord = async () => {
    setIsRecording(false);

    const result = await audioPlayer.stopRecorder();

    var files = await listFiles(recordDir);

    var highestNum = 0;

    files.map((item) => {
      var itemSplit = item.split("_draftv");

      var num = Number(itemSplit[itemSplit.length - 1].split(".")[0]);
      if (num > highestNum) {
        highestNum = num;
      }
    });

    await createDirectory(recordDir);

    var destFile =
      recordDir + translationStep + "_draftv" + (highestNum + 1) + ".mp4";

    await copyAndWriteFile(result, destFile, () => null);

    setAudioUri(result);
    setHasStarted(false);
  };

  const onStartPlay = async () => {
    isPlayRecording();

    const msg = await audioPlayer.startPlayer(audioURI);
    setPlaying(true);
  };

  const onPausePlay = async () => {
    
    if (hasStarted) {
      if (playing) {
        setPlaying(false);
        isNotPlayRecording();
        await audioPlayer.pausePlayer();
      } else {
        isPlayRecording();
        await audioPlayer.resumePlayer();
      }
    } else {
      disableAudio()
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
    disableAudio();
    setIsPlayingDraft(false);
    isNotPlayRecording();
  };

  const onStopPlay = async () => {
    audioPlayer.stopPlayer();
  };

  const openRecordingFolder = () => {
    openDraftRecordsDialog();
  };

  return (
    <>
      <View style={styles.title}>
        <TouchableOpacity
          style={{ paddingRight: 20 }}
          onPress={isRecording ? onStopRecord : onStartRecord}
        >
          <Icon
            color="white"
            source={isRecording ? "stop" : "microphone"}
            size={30}
          />
        </TouchableOpacity>
        {audioURI ? (
          <TouchableOpacity style={{ paddingRight: 20 }} onPress={onPausePlay}>
            <Icon color="white" source={playing ? "pause" : "play"} size={30} />
          </TouchableOpacity>
        ) : (
          ""
        )}
        <TouchableOpacity
          style={{ paddingRight: 20 }}
          onPress={openRecordingFolder}
        >
          <Icon color="white" source={"folder-edit-outline"} size={30} />
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog
          style={{ width: screenWidth - 50 }}
          visible={draftRecordsDialogVisible}
          onDismiss={closeDraftRecordsDialog}
          dismissable={false}
        >
          <Dialog.ScrollArea>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Dialog.Title style={styles.dialogTitle}>
                {t("Recordings", { lng: language })}:
              </Dialog.Title>

              <Dialog.Content>
                {draftRecordings.sort().map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: screenWidth - 100,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#D3D3D3",
                        padding: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => playDraftRecording(item, index)}
                      >
                        <Icon
                          color="black"
                          source={
                            isPlayingDraft && index === draftIndex
                              ? "stop"
                              : "play"
                          }
                          size={25}
                        />
                      </TouchableOpacity>

                      <Text style={{ fontSize: 15 }}>{item}</Text>

                      <TouchableOpacity
                        onPress={() => deleteDraftRecording(item)}
                      >
                        <Icon color="red" source="delete" size={25} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </Dialog.Content>
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button onPress={closeDraftRecordsDialog}>
              {t("Close", { lng: language })}
            </Button>
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
    padding: 10,
    margin: 3,
    color: "white",
    flexDirection: "row",
    width: "100%",
  },

  titleContainer: {
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
