import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import stripWordsofSpecialCharacters from "./StringFunctions";
import { useAppContext } from "@/context/AppContext";


interface italics {
  index: number;
  indexType: string;
}

var isItalic: boolean = false;

const buildPassage= (
    splitText: string[],
    opacity: number,
    highlightedPhrases: any[],
    highlightedWords: any[],
    openExegeticalDialog: (ndx: number) => void,
    openWordDialog: (ndx: number) => void,
    setOpacity: (opacity: number) => void,
):React.JSX.Element[] => {

  

  const textElements: React.JSX.Element[] = [];

  const { wordData } = useAppContext();

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

  return textElements;
};

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

export default buildPassage;

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
