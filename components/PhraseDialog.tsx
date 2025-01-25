import { Portal, Dialog, Text, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { ExegeticalNote } from "@/interfaces/appInterfaces";
import checkFileType from "@/helpers/FileTypeCheck";
import * as FileSystem from "expo-file-system";
import { useAppContext } from "@/context/AppContext";
import AutosizeImage from "@/helpers/AutoSizeImage";
import { useTranslation } from "react-i18next";
import AudioPlayer from "./HBAudioPlayer";

interface props {
  exegeticalDialogNote: ExegeticalNote;
  exegeticalDialogVisible: boolean;
  closeExegeticalDialog: (av: string) => void;
}

const PhraseDialog: React.FC<props> = ({
  exegeticalDialogNote,
  exegeticalDialogVisible,
  closeExegeticalDialog,
}) => {
  const { t } = useTranslation();

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();
  const safeAreaHeight = screenHeight - (insets.top + insets.bottom);
  const { template, language } = useAppContext();

  return (
    <Portal>
      <Dialog
        style={{ width: screenWidth - 50, maxHeight: safeAreaHeight - 25 }}
        visible={exegeticalDialogVisible}
        onDismiss={() => closeExegeticalDialog(exegeticalDialogNote.av)}
        dismissable={false}
      >
        <Dialog.ScrollArea>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Dialog.Content>
              <Text style={styles.dialogPhrase}>
                {exegeticalDialogNote.words}
              </Text>
            </Dialog.Content>

            <Dialog.Content>
              <Text style={styles.noteContent}>{exegeticalDialogNote.BEN}</Text>
            </Dialog.Content>

            {exegeticalDialogNote.av &&
            checkFileType(exegeticalDialogNote.av) === "image" ? (
              <AutosizeImage
                screenWidth={screenWidth - 50}
                source={{
                  uri:
                    FileSystem.documentDirectory +
                    template +
                    "/audioVisual/" +
                    exegeticalDialogNote.av,
                }}
              />
            ) : (
              ""
            )}

            {exegeticalDialogNote.comment ? (
              <Dialog.Title style={styles.dialogTitle}>
                {t("Comment", { lng: language })}:
              </Dialog.Title>
            ) : (
              ""
            )}

            {exegeticalDialogNote.comment ? (
              <Dialog.Content>
                <Text style={styles.dialogContent}>
                  {exegeticalDialogNote.comment}
                </Text>
              </Dialog.Content>
            ) : (
              ""
            )}

            {exegeticalDialogNote.parallelRef ? (
              <Dialog.Title style={styles.dialogTitle}>
                {t("Parallel References", { lng: language })}:
              </Dialog.Title>
            ) : (
              ""
            )}

            {exegeticalDialogNote.parallelRef ? (
              <Dialog.Content>
                <Text style={styles.dialogContent}>
                  {exegeticalDialogNote.parallelRef}
                </Text>
              </Dialog.Content>
            ) : (
              ""
            )}

            {exegeticalDialogNote.av &&
            checkFileType(exegeticalDialogNote.av) === "audio" ? (
              <AudioPlayer
                audioUri={[
                  FileSystem.documentDirectory +
                    template +
                    "/audioVisual/" +
                    exegeticalDialogNote.av,
                ]}
              />
            ) : (
              ""
            )}
          </ScrollView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          <IconButton
            icon="close-thick"
            size={32}
            onPress={() => closeExegeticalDialog(exegeticalDialogNote.av)}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default PhraseDialog;

const styles = StyleSheet.create({
  card: {},

  title: {
    backgroundColor: "red",
  },

  passage: {
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  passageText: {},

  words: {
    color: "blue",
    //textDecorationLine:"underline",
  },

  phrases: {
    color: "red",
  },

  italic: {
    fontStyle: "italic",
  },

  dialogContent: {
    fontSize: 12,
    backgroundColor: "transparent",
  },

  noteContent: {
    fontSize: 14,
    backgroundColor: "transparent",
  },

  dialogPhrase: {
    fontSize: 16,
    backgroundColor: "transparent",
    color: "red",
  },

  dialogTitle: {
    fontSize: 16,
  },

  superscript: {
    fontSize: 10,
    fontWeight: "bold",
    top: -2,
  },
});
