import * as React from "react";

import { useState, useEffect } from "react";
import { FlatList, Dimensions, View, TouchableOpacity } from "react-native";

import { Text, Searchbar } from "react-native-paper";

import { useAppContext } from "@/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import WordDialog from "@/components/WordDialog";
import { WordNote } from "@/interfaces/appInterfaces";

import { useTheme } from "react-native-paper";

const WordData = () => {
  interface wordData {
    word: string;
    meaning: string;
    hasRecording: boolean;
  }

  const { wordData,disableAudio } = useAppContext();

  useEffect(() => {
    console.log("useEffect");
    var entries: wordData[] = [];
    wordData.forEach((item, key) => {
      entries.push({
        word: key,
        meaning: item.meaning,
        hasRecording: item.hasRecording,
      });
    });

    setItems(entries);

    setFilteredItems(() => {
      return entries.filter((item) =>
        item.word.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    });
  }, [wordData]);

  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState("");

  const [filteredItems, setFilteredItems] = useState<wordData[]>([]);
  const [items, setItems] = useState<wordData[]>([]);

  const [wordDialogVisible, setWordDialogVisible] = useState<boolean>(false);
  const [wordDialogTitle, setWordDialogTitle] = useState<string>("");
  const [wordDialogNote, setWordDialogNote] = useState<WordNote>({
    altFormSym: "",
    otherLangEx: "",
    meaning: "",
    relatedTerms: "",
    hasRecording: false,
  });

  const closeWordDialog = () => {
    setWordDialogVisible(false);
    disableAudio();
  };

  const openWordDialog = (item: string) => {
    setWordDialogVisible(true);

    setWordDialogTitle(item);

    var dialogNotes = wordData.get(item);

    setWordDialogNote(dialogNotes!);
  };

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);

    setFilteredItems(() => {
      return items.filter((item) =>
        item.word.toLowerCase().startsWith(query.toLowerCase())
      );
    });
  };

  //   const [items, setItems] = React.useState(() => {
  //     var entries: wordData[] = [];
  //     wordData.forEach((item, key) => {
  //       entries.push({
  //         word: key,
  //         meaning: item.meaning,
  //         hasRecording: item.hasRecording,
  //       });
  //     });

  //     setFilteredItems(entries);
  //     return entries;
  //   });

  const Item = ({ item }: { item: wordData }) => (
    <View style={[styles.item, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={() => openWordDialog(item.word)}>
        <Text
          style={[
            styles.word,
            {
              color: item.hasRecording ? "black" : "blue",
              textDecorationLine: item.hasRecording ? "underline" : "none",
            },
          ]}
        >
          {item.word}
        </Text>
      </TouchableOpacity>
      <Text style={styles.meaning} numberOfLines={3} ellipsizeMode="tail">
        {item.meaning}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: wordData }) => <Item item={item} />;

  return (
    <SafeAreaView>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.word}
      />
      <WordDialog
        wordDialogTitle={wordDialogTitle}
        wordDialogNote={wordDialogNote}
        closeWordDialog={closeWordDialog}
        wordDialogVisible={wordDialogVisible}
      />
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;
const numColumns = 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: "#f9c2ff",
    borderRadius: 5,
  },
  word: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  meaning: {
    flexWrap: "wrap",
    width: windowWidth - 70, // Adjust for margins
  },
  columnWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default WordData;
