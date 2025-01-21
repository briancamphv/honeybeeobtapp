import { Portal, Dialog, Text, IconButton } from "react-native-paper";
import { ScrollView, StyleSheet, Dimensions } from "react-native";
import stripWordsofSpecialCharacters from "@/helpers/StringFunctions";
import { useAppContext } from "@/context/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import HBRecordBar from "./HBRecordBar";
import * as FileSystem from "expo-file-system";
import { WordNote } from "@/interfaces/appInterfaces";

interface prop {
  wordDialogTitle: String;
  wordDialogNote: WordNote;
  wordDialogVisible: boolean;
  closeWordDialog: () => void;
}

const WordDialog: React.FC<prop> = ({
  wordDialogNote,
  wordDialogTitle,
  wordDialogVisible,
  closeWordDialog,
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

  const { language, disableAudio } = useAppContext();
  const insets = useSafeAreaInsets();
  const safeAreaHeight = screenHeight - (insets.top + insets.bottom);
  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog
        style={{ width: screenWidth - 50, maxHeight: safeAreaHeight - 25 }}
        visible={wordDialogVisible}
        onDismiss={() => {
          closeWordDialog();
        }}
        dismissable={false}
      >
        <Dialog.ScrollArea>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <Dialog.Content>
              <Text style={styles.dialogWord}>
                {stripWordsofSpecialCharacters(
                  wordDialogTitle.toString(),
                  ".,;"
                )}
              </Text>
            </Dialog.Content>

            <Dialog.Title style={styles.dialogTitle}>
              {t("Meaning", { lng: language })}:
            </Dialog.Title>

            <Dialog.Content>
              <Text style={styles.dialogContent}>
                {wordDialogNote?.meaning}
              </Text>
            </Dialog.Content>

            {wordDialogNote?.altFormSym ? (
              <Dialog.Title style={styles.dialogTitle}>
                {t("Alternate Forms or Synonyms", { lng: language })}:
              </Dialog.Title>
            ) : (
              ""
            )}

            {wordDialogNote?.altFormSym ? (
              <Dialog.Content>
                <Text style={styles.dialogContent}>
                  {wordDialogNote.altFormSym}
                </Text>
              </Dialog.Content>
            ) : (
              ""
            )}

            {wordDialogNote?.otherLangEx ? (
              <Dialog.Title style={styles.dialogTitle}>
                {t("Other Language Examples", { lng: language })}:
              </Dialog.Title>
            ) : (
              ""
            )}

            {wordDialogNote?.otherLangEx ? (
              <Dialog.Content>
                <Text style={styles.dialogContent}>
                  {wordDialogNote.otherLangEx}
                </Text>
              </Dialog.Content>
            ) : (
              ""
            )}

            {wordDialogNote?.relatedTerms ? (
              <Dialog.Title style={styles.dialogTitle}>
                {t("Related Terms", { lng: language })}:
              </Dialog.Title>
            ) : (
              ""
            )}

            {wordDialogNote?.relatedTerms ? (
              <Dialog.Content>
                <Text style={styles.dialogContent}>
                  {wordDialogNote.relatedTerms}
                </Text>
              </Dialog.Content>
            ) : (
              ""
            )}
          </ScrollView>
        </Dialog.ScrollArea>

        <HBRecordBar
          translationStep="wordstudy"
          recordDir={
            FileSystem.documentDirectory! +
            language +
            "/" +
            stripWordsofSpecialCharacters(wordDialogTitle.toString(), ".,;") +
            "/"
          }
          screenWidthAdj={55}
        />

        <Dialog.Actions>
          <IconButton icon="close-thick" size={32} onPress={closeWordDialog} />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  card: {},

  title: {
    backgroundColor: "red",
  },

  dialogWord: {
    fontSize: 16,
    backgroundColor: "transparent",
    color: "blue",
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

  dialogContent: {
    fontSize: 12,
    backgroundColor: "transparent",
  },

  noteContent: {
    fontSize: 14,
    backgroundColor: "transparent",
  },

  dialogPhrase: {
    fontSize: 14,
    backgroundColor: "transparent",
    color: "red",
  },

  dialogTitle: {
    fontSize: 16,
  },
});

export default WordDialog;
