import * as React from "react";
import { useEffect, useState } from "react";

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WordDialog from "./WordDialog";
import { WordNote } from "@/interfaces/appInterfaces";

import {
  createDirectory,
  copyAndWriteFile,
  deleteFile,
  fileExists,
} from "@/helpers/FileUtilies";

import checkFileType from "@/helpers/FileTypeCheck";

import { Alert } from "react-native";
import { StyleSheet, View, Dimensions, ScrollView, Image } from "react-native";

import {
  Card,
  Text,
  Dialog,
  Portal,
  Modal,
  IconButton,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";

import AutosizeImage from "@/helpers/AutoSizeImage";
import AudioPlayer from "./HBAudioPlayer";

import stripWordsofSpecialCharacters, {
  stripWordsofTokens,
} from "@/helpers/StringFunctions";

import HBRecordBar from "./HBRecordBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

interface HBScriptureCard {
  imageURI: string;
  passageText: string;
  title: string;
  notes: any[];
  audioURI: string;
  setLoading: (loading: boolean) => void;
}

interface HBScriptureNote {
  words: string;
  BEN: string;
  parallelRef: string;
  comment: string;
  av: string;
}

interface italics {
  index: number;
  indexType: string;
}

const HBScriptureCard: React.FC<HBScriptureCard> = ({
  imageURI,
  passageText,
  title,
  notes,
  audioURI,
  setLoading,
}) => {
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [scriptureImageExist, setScriptureImageExist] = useState(false);
  const [highlightedPhrases, setHighlightedPhrases] = useState<any[]>([]);
  const [highlightedPassage, setHighlightedPassage] = useState<String>("");
  const [image, setImage] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(0);
  var isItalic: boolean = false;
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

  const {
    language,
    changeImage,
    revertImage,
    template,
    disableAudio,

    wordData,
    setHasRecording,
  } = useAppContext();

  const [wordDialogNote, setWordDialogNote] = useState<WordNote>({
    altFormSym: "",
    otherLangEx: "",
    meaning: "",
    relatedTerms: "",
    hasRecording: false,
  });
  const [wordDialogTitle, setWordDialogTitle] = useState<String>("");

  const openExegeticalDialog = (ndx: number) => {
    setExegeticalDialogVisible(true);

    setExegeticalDialogNote(highlightedPhrases[ndx]);
  };

  const insets = useSafeAreaInsets();
  const safeAreaHeight = screenHeight - (insets.top + insets.bottom);

  const openWordDialog = (ndx: number) => {
    setWordDialogVisible(true);

    setWordDialogTitle(highlightedWords[ndx]);

    var dialogNotes = wordData.get(
      stripWordsofSpecialCharacters(highlightedWords[ndx], '",.;')
    );

    setWordDialogNote(dialogNotes!);
  };

  const closeExegeticalDialog = (av: any) => {
    setExegeticalDialogVisible(false);

    if (av) {
      disableAudio();
    }
  };

  const closeWordDialog = () => {
    setWordDialogVisible(false);
    disableAudio();
  };

  const highlightWords = (tokenizedPassage: string): string => {
    var wordLinks: any[] = [];
    var ndx = 0;
    var modifiedPassage = tokenizedPassage;

    tokenizedPassage.split(" ").map((word, index) => {
      var newWord = stripWordsofTokens(
        stripWordsofSpecialCharacters(word, '",.;!'),
        "<i>,</i>,«,»"
      ).trim();

      if (wordData.get(newWord)) {
        modifiedPassage = modifiedPassage.replace(
          newWord,
          "<<<~wndx~" + ndx + "<<<"
        );

        wordLinks.push(newWord);
        ndx++;
      }
    });
    setHighlightedWords(wordLinks);

    return modifiedPassage;
  };

  useEffect(() => {
    if (imageHeight === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [imageHeight]);

  useEffect(() => {
    setHighlightedPassage(passageText);
  }, [passageText]);

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

  const recordDir =
    FileSystem.documentDirectory! +
    template +
    "/" +
    stripWordsofSpecialCharacters(title, ":") +
    "/";

  useEffect(() => {
    if (image === null) {
      return;
    }

    var destFile = recordDir + "scriptureImage.jpg";

    createDirectory(recordDir).then(() => {
      copyAndWriteFile(image!, destFile, (name: string) => null).then(() => {
        changeImage(image);
      });
    });
  }, [image]);

  useEffect(() => {
    fileExists(recordDir + "scriptureImage.jpg").then((ret) =>
      setScriptureImageExist(ret)
    );
  }, [imageURI]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const deleteImage = () => {
    Alert.alert(
      t("Confirmation", { lng: language }),
      t(
        "Are you sure you want to proceed?  Proceeding will revert to the original image.",
        { lng: language }
      ),
      [
        {
          text: t("No", { lng: language }),
          onPress: () => {},
          style: "cancel",
        },
        {
          text: t("Yes", { lng: language }),
          onPress: () => {
            deleteFile(recordDir + "scriptureImage.jpg");
            revertImage();
          },
        },
      ],
      { cancelable: false } // Prevents dismissing the alert by tapping outside
    );
  };
  const textElements: React.JSX.Element[] = [];

  const superScriptNumbers = (
    word: string,
    index: number,
    modifiedElements: React.JSX.Element[] = []
  ) => {
    var output: string[] = [];
    var verseNumbers: string[] = [];

    var regex = /\d+/g;

    var match;

    match = word.match(regex);

    match?.map((verseNumber) => {
      verseNumbers.push(verseNumber);
      output.push(word.split(verseNumber)[0]);
      word = word.split(verseNumber)[1];
    });

    output.push(word);

    var verseNdx: number = 0;

    output.map((text, outputNdx) => {
      if (text === "") {
        modifiedElements.push(
          <View
            key={index + 10}
            style={{ flex: 1, justifyContent: "flex-start" }}
          >
            <Text
              style={[
                styles.superscript,
                { fontStyle: isItalic ? "italic" : "normal" },
              ]}
            >
              {verseNumbers[verseNdx]}
            </Text>
          </View>
        );
        verseNdx++;
      } else {
        modifiedElements.push(
          <Text
            style={[
              styles.passageText,
              { fontStyle: isItalic ? "italic" : "normal" },
            ]}
            key={index + 20 + (outputNdx + 1)}
          >
            {text}
          </Text>
        );

        if (verseNdx <= verseNumbers.length - 1) {
          modifiedElements.push(
            <View
              key={index + 30}
              style={{ flex: 1, justifyContent: "flex-start" }}
            >
              <Text
                style={[
                  styles.superscript,
                  { fontStyle: isItalic ? "italic" : "normal" },
                ]}
              >
                {verseNumbers[verseNdx]}
              </Text>
            </View>
          );
          verseNdx++;
        }
      }
    });
  };

  const buildScripturePassage = () => {
    splitText.map((word, index) => {
      if (word.includes("~pndx~")) {
        var ndx = parseInt(word.substring(6));

        textElements.push(
          <Text
            variant="bodyMedium"
            style={[
              styles.phrases,
              { opacity: opacity, fontStyle: isItalic ? "italic" : "normal" },
            ]}
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

        var wordnote = wordData.get(
          stripWordsofSpecialCharacters(highlightedWords[ndx], ",.;")
        );

        var hasRecording = wordnote?.hasRecording;

        textElements.push(
          <Text
            variant="bodyMedium"
            style={[
              styles.words,
              {
                opacity: opacity,
                fontStyle: isItalic ? "italic" : "normal",
                color: hasRecording ? "black" : "blue",
                textDecorationLine: hasRecording ? "underline" : "none",
              },
            ]}
            onPress={() => openWordDialog(ndx)}
            onPressIn={() => setOpacity(0.5)}
            onPressOut={() => setOpacity(1)}
            key={index}
          >
            {highlightedWords[ndx]}
          </Text>
        );
      } else {
        var italicsIndexes: italics[] = [];
        var startItalicIndex: number = 0;
        var endItalicIndex: number = 0;

        startItalicIndex = word.indexOf("<i>");

        while (startItalicIndex !== -1) {
          italicsIndexes.push({ index: startItalicIndex, indexType: "start" });
          startItalicIndex = word.indexOf("<i>", startItalicIndex + 1);
        }

        endItalicIndex = word.indexOf("</i>");
        while (endItalicIndex !== -1) {
          italicsIndexes.push({ index: endItalicIndex, indexType: "end" });
          endItalicIndex = word.indexOf("</i>", endItalicIndex + 1);
        }

        const sortedItalicsIndexes = italicsIndexes.sort(
          (a, b) => a.index - b.index
        );

        var beginIndex = 0;

        sortedItalicsIndexes.map((italicIndex: italics, sortedNdx) => {
          superScriptNumbers(
            word.substring(beginIndex, italicIndex.index),
            index * (sortedNdx + 2),
            textElements
          );

          isItalic = italicIndex.indexType === "start" ? true : false;

          beginIndex =
            italicIndex.indexType === "end"
              ? italicIndex.index + 4
              : italicIndex.index + 3;
        });

        if (sortedItalicsIndexes.length === 0) {
          superScriptNumbers(word, index * 100 + 10000, textElements);
        } else {
          superScriptNumbers(
            word.substring(beginIndex),
            index * 100 + 20000,
            textElements
          );
        }
      }
    });
  };

  buildScripturePassage();

  Image.getSize(imageURI, (imgWidth, imgHeight) => {
    const aspectRatio = imgHeight / imgWidth;
    const calculatedHeight = screenWidth * aspectRatio;
    setImageHeight(calculatedHeight);
  });

  return (
    <>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.card}
      >
        <View style={styles.card}>
          <Card mode="contained" style={{ backgroundColor: "#f0f0f0" }}>
            <View>
              {/* t= set to clear cache */}
              <Card.Cover
                // source={{ uri: imageURI + "?t=" + Date.now() }}
                source={{ uri: imageURI }}
                style={{ height: imageHeight }}
              />

              {/*  uncomment the following code to enable image selection/replacement
          
          <View
            style={{
              position: "absolute",
              top: 5,
              left: 10,
            }}
          >
            <TouchableOpacity onPress={pickImage}>
              <Icon color="black" source={"image"} size={23} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: "absolute",
              top: 30,
              left: 10,
            }}
          >
            <TouchableOpacity onPress={takePhoto}>
              <Icon color="black" source={"camera"} size={23} />
            </TouchableOpacity>
          </View>

          {scriptureImageExist ? (
            <View
              style={{
                position: "absolute",
                top: 55,
                left: 10,
              }}
            >
              <TouchableOpacity onPress={deleteImage}>
                <Icon color="black" source={"delete"} size={23} />
              </TouchableOpacity>
            </View>
          ) : (
            ""
          )} */}
            </View>

            <AudioPlayer audioUri={audioURI} />
            <Card.Content>
              <View>
                <Text variant="titleLarge">{title}</Text>

                <View style={styles.passage}>
                  <Text style={{ opacity }}>
                    {textElements.map((element) => {
                      return element;
                    })}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

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
                <Text style={styles.noteContent}>
                  {exegeticalDialogNote.BEN}
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

      <WordDialog
        wordDialogTitle={wordDialogTitle}
        wordDialogNote={wordDialogNote}
        closeWordDialog={closeWordDialog}
        wordDialogVisible={wordDialogVisible}
      />
    </>
  );
};

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

export default HBScriptureCard;
