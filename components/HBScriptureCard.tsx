import * as React from "react";
import { useEffect, useState } from "react";

import { StyleProp, StyleSheet, View, TouchableOpacity } from "react-native";

import { Card, Text, Dialog, Portal, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type Props = {
  size: number;
};

interface HBScriptureCard {
  imageURI: string;
  passageText: string;
  title: string;
  notes: any[];
}

const HBScriptureCard: React.FC<HBScriptureCard> = ({
  imageURI,
  passageText,
  title,
  notes,
}) => {
  const [highlightedWords, setHighlightedWords] = useState<any[]>([]);
  const [highlightedPassage, setHighlightedPassage] = useState<String>("");
  const [opacity, setOpacity] = useState(1);
  const [wordDialogVisible, setWordDialogVisible] = useState(false);
  const [wordDialogText, setWordDialogText] = useState("");

  const openWordDialog = (ndx: number) => {
    setWordDialogVisible(true);
    console.log("highlightedWords",highlightedWords, ndx)
    setWordDialogText(highlightedWords[ndx].BEN);
  };
  const closeWordDialog = () => setWordDialogVisible(false);

  useEffect(() => {
    if (notes === null) {
      return;
    }

    var modifiedPassage = "";
    var phrases: any[] = [];

    var ndx = 0;

    var tokenizedPassage = passageText;

    notes.map((note, index) => {
      tokenizedPassage = tokenizedPassage.replace(
        note.words,
        "<<<~ndx~" + index + "<<<"
      );
      phrases.push({ words: note.words, index: index, BEN: note.BEN });
    });

    setHighlightedWords(phrases);
    setHighlightedPassage(tokenizedPassage);
  }, [notes]); // Empty dependency array

  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

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
                if (word.includes("~ndx~")) {
                  console.log("index", parseInt(word.substring(5)));
                  var ndx = parseInt(word.substring(5));
                  return (
                    <Text
                      variant="bodyMedium"
                      style={[styles.words, { opacity: opacity }]}
                      onPress={() => openWordDialog(ndx)}
                      onPressIn={() => setOpacity(0.5)}
                      onPressOut={() => setOpacity(1)}
                      key={index}
                    >
                      {highlightedWords[ndx].words}
                    </Text>
                  );
                } else {
                  return (
                    <Text key={index} variant="bodyMedium">
                      {" "}
                      {word}{" "}
                    </Text>
                  );
                }
              })}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={wordDialogVisible} onDismiss={closeWordDialog}>
          <Dialog.Title>Word Study</Dialog.Title>
          <Dialog.Content>
            <Text>{wordDialogText}</Text>
          </Dialog.Content>
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
    color: "red",
  },
});

export default HBScriptureCard;
