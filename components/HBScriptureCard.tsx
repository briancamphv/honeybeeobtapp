import * as React from "react";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";

import checkFileType from "@/helpers/FileTypeCheck";

import { StyleProp, StyleSheet, View, Image, Dimensions } from "react-native";

import { Card, Text, Dialog, Portal, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";

import AutosizeImage from "@/helpers/AutoSizeImage";
import AudioPlayer from "./HBAudioPlayer";

import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

const { width: screenWidth } = Dimensions.get("screen");

interface HBScriptureCard {
  imageURI: string;
  passageText: string;
  title: string;
  notes: any[];
}

interface HBScriptureNote {
  words: string;
  BEN: string;
  parallelRef: string;
  comment: string;
  av: string;
}

interface WordNote {
  altFormSym: string;
  otherLangEx: string;
  meaning: string;
  relatedTerms: string;
}

const HBScriptureCard: React.FC<HBScriptureCard> = ({
  imageURI,
  passageText,
  title,
  notes,
}) => {
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [highlightedPhrases, setHighlightedPhrases] = useState<any[]>([]);
  const [highlightedPassage, setHighlightedPassage] = useState<String>("");
  const [opacity, setOpacity] = useState(1);
  const [exegeticalDialogVisible, setExegeticalDialogVisible] = useState(false);
  const [wordDialogVisible, setWordDialogVisible] = useState(false);
  const [exegeticalDialogNote, setExegeticalDialogNote] =
    useState<HBScriptureNote>({
      words: "",
      BEN: "",
      parallelRef: "",
      comment: "",
      av: "",
    });

  const { language } = useAppContext();
  

  const [wordDialogNote, setWordDialogNote] = useState<WordNote>();
  const [wordDialogTitle, setWordDialogTitle] = useState<String>("");

  const openExegeticalDialog = (ndx: number) => {
    setExegeticalDialogVisible(true);

    setExegeticalDialogNote(highlightedPhrases[ndx]);
  };

  const openWordDialog = (ndx: number) => {
    setWordDialogVisible(true);

    setWordDialogTitle(highlightedWords[ndx]);

    var dialogNotes = wordData.get(
      stripWordsofSpecialCharacters(highlightedWords[ndx], '",.;')
    );

    setWordDialogNote(dialogNotes);
  };

  const { template, disableAudio, wordData } = useAppContext();

  const closeExegeticalDialog = () => {
    setExegeticalDialogVisible(false);
    disableAudio();
  };

  const closeWordDialog = () => {
    setWordDialogVisible(false);
  };

  const stripWordsofSpecialCharacters = (
    word: string,
    charsToRemove: string
  ): string => {
    let newWord = word;
    for (const char of charsToRemove) {
      newWord = newWord.replace(char, "");
    }

    return newWord;
  };

  const highlightWords = (tokenizedPassage: string): string => {
    var wordLinks: any[] = [];
    var ndx = 0;
    var modifiedPassage = tokenizedPassage;

    tokenizedPassage.split(" ").map((word, index) => {
      var newWord = stripWordsofSpecialCharacters(word, '",.;');

      if (wordData.get(newWord)) {
        modifiedPassage = modifiedPassage.replace(
          word,
          "<<<~wndx~" + ndx + "<<<"
        );

        wordLinks.push(word);
        ndx++;
      }
    });
    setHighlightedWords(wordLinks);
    return modifiedPassage;
  };

  useEffect(() => {
    if (notes === null || notes === undefined) {
      var modifiedPassage = highlightWords(passageText);
      setHighlightedPassage(modifiedPassage);
      return;
    }

    var phrases: any[] = [];

    var ndx = 0;

    var tokenizedPassage = passageText;

    notes.map((note, index) => {
      tokenizedPassage = tokenizedPassage.replace(
        note.words,
        "<<<~pndx~" + index + "<<<"
      );

      phrases.push({
        words: note.words,
        index: index,
        BEN: note.BEN,
        parallelRef: note.parallelRef,
        comment: note.comment,
        av: note.av,
      });
    });

    // tokenize for words

    var modifiedPassage = highlightWords(tokenizedPassage);

    setHighlightedPhrases(phrases);

    setHighlightedPassage(modifiedPassage);
  }, [notes]); // Empty dependency array

  const { t } = useTranslation();

  const splitText = highlightedPassage.split("<<<");

  return (
    <>
      <Card>
        <Card.Cover source={{ uri: imageURI }} />

        <Card.Content>
          <Text variant="titleLarge">{title}</Text>
          <View style={styles.passage}>
            <Text style={{ opacity }}>
              {splitText.map((word, index) => {
                if (word.includes("~pndx~")) {
                  var ndx = parseInt(word.substring(6));
                  return (
                    <Text
                      variant="bodyMedium"
                      style={[styles.phrases, { opacity: opacity }]}
                      onPress={() => openExegeticalDialog(ndx)}
                      onPressIn={() => setOpacity(0.5)}
                      onPressOut={() => setOpacity(1)}
                      key={index}
                    >
                      {highlightedPhrases[ndx].words}
                    </Text>
                  );
                } else if (word.includes("~wndx~")) {
                  var ndx = parseInt(word.substring(6));
                  return (
                    <Text
                      variant="bodyMedium"
                      style={[styles.words, { opacity: opacity }]}
                      onPress={() => openWordDialog(ndx)}
                      onPressIn={() => setOpacity(0.5)}
                      onPressOut={() => setOpacity(1)}
                      key={index}
                    >
                      {highlightedWords[ndx]}
                    </Text>
                  );
                } else {
                  return <Text key={index}> {word} </Text>;
                }
              })}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog
          style={{ width: screenWidth - 50 }}
          visible={exegeticalDialogVisible}
          onDismiss={closeExegeticalDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>{t("Phrase", { lng: language })}:</Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogContent}>
              {exegeticalDialogNote.words}
            </Text>
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

          <Dialog.Title style={styles.dialogTitle}>
            {t("Exegetical Notes", { lng: language })}:
          </Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogContent}>{exegeticalDialogNote.BEN}</Text>
          </Dialog.Content>

          {exegeticalDialogNote.comment ? (
            <Dialog.Title style={styles.dialogTitle}>{t("Commentary", { lng: language })}:</Dialog.Title>
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
              audioUri={
                FileSystem.documentDirectory +
                template +
                "/audioVisual/" +
                exegeticalDialogNote.av
              }
            />
          ) : (
            ""
          )}

          <Dialog.Actions>
            <Button onPress={closeExegeticalDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog
          style={{ width: screenWidth - 50 }}
          visible={wordDialogVisible}
          onDismiss={closeWordDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>{t("Word Study", { lng: language })}:</Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogContent}>{wordDialogTitle}</Text>
          </Dialog.Content>

          <Dialog.Title style={styles.dialogTitle}>{t("Meaning", { lng: language })}:</Dialog.Title>

          <Dialog.Content>
            <Text style={styles.dialogContent}>{wordDialogNote?.meaning}</Text>
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

          <Dialog.Actions>
            <Button onPress={closeWordDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "red",
  },

  passage: {
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  words: {
    color: "blue",
  },

  phrases: {
    color: "red",
  },

  dialogContent: {
    fontSize: 12,
  },

  dialogTitle: {
    fontSize: 16,
  },
});

export default HBScriptureCard;
