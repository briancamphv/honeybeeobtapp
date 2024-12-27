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

type Props = {
  size: number;
};

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

  const [wordDialogNote, setWordDialogNote] = useState<WordNote>();
  const [wordDialogTitle, setWordDialogTitle] = useState<String>("");

  const openExegeticalDialog = (ndx: number) => {
    setExegeticalDialogVisible(true);

    setExegeticalDialogNote(highlightedPhrases[ndx]);
  };

  const openWordDialog = (ndx: number) => {
    setWordDialogVisible(true);

    setWordDialogTitle(highlightedWords[ndx]);

    var dialogNotes = wordData.get(highlightedWords[ndx]);

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

  const highlightWords = (tokenizedPassage:string):string => {

    var wordLinks: any[] = [];
    var ndx = 0;
    var modifiedPassage = tokenizedPassage;

    tokenizedPassage.split(" ").map((word, index) => {
      console.log("Word", word);

      if (wordData.get(word)) {
        console.log("Modify Word", word);
        modifiedPassage = modifiedPassage.replace(
          word,
          "<<<~wndx~" + ndx + "<<<"
        );

        wordLinks.push(word);
        ndx++;
      }
    });
    setHighlightedWords(wordLinks);
    return modifiedPassage
  }
 
  useEffect(() => {
    if (notes === null || notes === undefined) {
      var modifiedPassage=highlightWords(passageText);
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

    var modifiedPassage=highlightWords(tokenizedPassage)
 
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
          <Dialog.Title>Phrase:</Dialog.Title>

          <Dialog.Content>
            <Text>{exegeticalDialogNote.words}</Text>
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

          <Dialog.Title>Exegetical Notes:</Dialog.Title>

          <Dialog.Content>
            <Text>{exegeticalDialogNote.BEN}</Text>
          </Dialog.Content>

          {exegeticalDialogNote.comment ? (
            <Dialog.Title>Commentary:</Dialog.Title>
          ) : (
            ""
          )}

          {exegeticalDialogNote.comment ? (
            <Dialog.Content>
              <Text>{exegeticalDialogNote.comment}</Text>
            </Dialog.Content>
          ) : (
            ""
          )}

          {exegeticalDialogNote.parallelRef ? (
            <Dialog.Title>Parallel References:</Dialog.Title>
          ) : (
            ""
          )}

          {exegeticalDialogNote.parallelRef ? (
            <Dialog.Content>
              <Text>{exegeticalDialogNote.parallelRef}</Text>
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
          <Dialog.Title>Word Study:</Dialog.Title>

          <Dialog.Content>
            <Text>{wordDialogTitle}</Text>
          </Dialog.Content>

          <Dialog.Title>Meaning:</Dialog.Title>

          <Dialog.Content>
            <Text>{wordDialogNote?.meaning}</Text>
          </Dialog.Content>

          {wordDialogNote?.altFormSym ? (
            <Dialog.Title>Alternate Form or Synonyms:</Dialog.Title>
          ) : (
            ""
          )}

          {wordDialogNote?.altFormSym ? (
            <Dialog.Content>
              <Text>{wordDialogNote.altFormSym}</Text>
            </Dialog.Content>
          ) : (
            ""
          )}

          {wordDialogNote?.otherLangEx ? (
            <Dialog.Title>Other Language Examples:</Dialog.Title>
          ) : (
            ""
          )}

          {wordDialogNote?.otherLangEx ? (
            <Dialog.Content>
              <Text>{wordDialogNote.otherLangEx}</Text>
            </Dialog.Content>
          ) : (
            ""
          )}

          {wordDialogNote?.relatedTerms ? (
            <Dialog.Title>Related Terms:</Dialog.Title>
          ) : (
            ""
          )}

          {wordDialogNote?.relatedTerms ? (
            <Dialog.Content>
              <Text>{wordDialogNote.relatedTerms}</Text>
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
});

export default HBScriptureCard;
