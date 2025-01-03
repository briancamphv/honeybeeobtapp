import React, { useState, useRef } from "react";
import { View, ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Title, Appbar } from "react-native-paper";

import ChapterCards from "@/components/ChapterCards";
import { useNavigation } from "expo-router";

import { useTranslation } from "react-i18next";
import BooksOfBible from "../data/BooksOfBible";
import ChaptersOfBible from "../data/ChaptersOfBible";
import { useAppContext } from "@/context/AppContext";

const BibleBookList: React.FC = () => {



  const scrollViewRef = useRef<ScrollView>(null);

  const { language } = useAppContext();

  const handleScroll = (event: {
    nativeEvent: { contentOffset: { y: number } };
  }) => {
    if (areBooksVisible) {
      setCurrentScrollY(event.nativeEvent.contentOffset.y);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 0, // Scroll to the top (y = 0)
        animated: false, // Add smooth animation
      });
    }
  };

  const scrollToPrevPos = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: currentScrollY, // Scroll to the prev (y = prev scroll pos)
        animated: true, // Add smooth animation
      });
    }
  };

  
  function handleBookPress(item: string) {
    setBibleBook(item);
    setAreBooksVisible(false);
    setAreChaptersVisible(true);
    scrollToTop();
  }

  const { t } = useTranslation();

  const [areBooksVisible, setAreBooksVisible] = useState<Boolean>(true);
  const [areChaptersVisible, setAreChaptersVisible] = useState<Boolean>(false);
  const [bibleBook, setBibleBook] = useState<string>("");
  const [currentScrollY, setCurrentScrollY] = useState<number>(0);

  const renderBooks = (item: string, index: number) => (
    <Card
      key={index}
      style={styles.books}
      onPress={() => handleBookPress(item)}
    >
      <Card.Content>
        <View style={styles.container}>
          <Title numberOfLines={2} style={styles.bookTitle}>
            {t(item, { lng: language })}
          </Title>
        </View>
      </Card.Content>
    </Card>
  );

  const renderChapters = (item: string, index: number) => (
    <ChapterCards
      book={bibleBook}
      template={item}
      index={index}
      language={language}
      setAreChaptersVisible={setAreChaptersVisible}
      setAreBooksVisible={setAreBooksVisible}
    />
  );

  return (
    <SafeAreaView>
      <View>
        <Appbar.Header>
          {areChaptersVisible ? (
            <Appbar.Action
              icon="chevron-left"
              size={30}
              color="black"
              onPress={() => {
                setAreChaptersVisible(false);
                setAreBooksVisible(true);
                scrollToPrevPos();
              }}
            />
          ) : (
            ""
          )}
          <Appbar.Content title={t("Templates", { lng: language })} />
        </Appbar.Header>

        <ScrollView
          bounces={false}
          ref={scrollViewRef}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 300 }}
        >
          {areBooksVisible && (
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              {BooksOfBible.map((item, index) => renderBooks(item, index))}
            </View>
          )}
          {areChaptersVisible && (
            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
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
    alignContent: "center",
  },
  container: {
    alignItems: "center",
    wordWrap: "2",
  },
  bookTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
