import React, { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import {
  Card,
  Title,
  Appbar,
  IconButton,
  MD3Colors,
  Button,
} from "react-native-paper";
import GetTemplate from "@/components/GetTemplate";
import { useNavigation } from "expo-router";

import { useTranslation } from "react-i18next";
import BooksOfBible from "../data/BooksOfBible";
import ChaptersOfBible from "../data/ChaptersOfBible";
import { useAppContext } from "@/context/AppContext";
import { DrawerActions } from "@react-navigation/native";

const BibleBookList: React.FC = () => {
  const navigation = useNavigation();
  function handleBookPress(item: string) {
    setBibleBook(item);
    setAreBooksVisible(false);
    setAreChaptersVisible(true);
  }

  function handleChapterPress(item: string) {
    setStep("translate");
    loadTemplate(item).then(() => {
      navigation.dispatch(DrawerActions.jumpTo("TranslateAndRevise"));
      setAreChaptersVisible(false);
      setAreBooksVisible(true);
    });
  }

  const { loadTemplate, languageSwitcher, language, setStep } = useAppContext();

  const { t } = useTranslation();



  const [areBooksVisible, setAreBooksVisible] = useState<Boolean>(true);
  const [areChaptersVisible, setAreChaptersVisible] = useState<Boolean>(false);
  const [bibleBook, setBibleBook] = useState<string>("");

  const renderBooks = (item: string, index: number) => (
    <Card
      key={index}
      style={styles.books}
      onPress={() => handleBookPress(item)}
    >
      <Card.Content>
        <Title numberOfLines={2} style={styles.bookTitle}>
          {t(item, { lng: language })}
        </Title>
      </Card.Content>
    </Card>
  );

  const renderChapters = (item: string, index: number) => (
    <Card
      key={index}
      style={styles.chapters}
      onPress={() => handleChapterPress(item)}
    >
      <Card.Content>
        <Title numberOfLines={2} style={styles.chapterTitle}>
          {t(item, { lng: language })}
        </Title>
        <View style={styles.iconContainer}>
          <IconButton
            icon="download"
            iconColor={"blue"}
            size={25}
            onPress={() => console.log("Pressed")}
          />
          <GetTemplate />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView>
      <View>
        <Appbar.Header>
          <Appbar.Content title={t("Templates", { lng: language })} />
        </Appbar.Header>

        <ScrollView showsVerticalScrollIndicator={false}>
          {areBooksVisible && (
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              {BooksOfBible.map((item, index) => renderBooks(item, index))}
            </View>
          )}
          {areChaptersVisible && (
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              <Button
                onPress={() => {
                  setAreChaptersVisible(false);
                  setAreBooksVisible(true);
                }}
              >
                Go Back
              </Button>
              {ChaptersOfBible.filter((item) => item.includes(bibleBook)).map(
                (item, index) => renderChapters(item, index)
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BibleBookList;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
  },
  books: {
    width: 120, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
  },
  chapters: {
    width: 180, // Adjust the width as needed
    height: 120, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
  },
  bookTitle: {
    fontSize: 13,
    fontWeight: "bold",
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
