import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Appbar } from "react-native-paper";
import { Link } from "expo-router";

import { useTranslation } from "react-i18next";

import booksOfBible from "../data/BooksOfBible";

const BibleBookList: React.FC = () => {
  function handleCardPress(item: string) {
    console.log("item pressed", item);
  }

  const { t } = useTranslation();

  const renderItem = (item: string) => (
    <Card style={styles.card} onPress={() => handleCardPress(item)}>
      <Card.Content>
        <Title numberOfLines={2} style={styles.title}>
          {t(item)}
        </Title>
      </Card.Content>
    </Card>
  );

  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title={t("Templates")} />
      </Appbar.Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {booksOfBible.map(renderItem)}
        </View>
      </ScrollView>
    </View>
  );
};

export default BibleBookList;

const styles = StyleSheet.create({
  card: {
    width: 120, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
