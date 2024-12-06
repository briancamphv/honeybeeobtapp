import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Appbar } from "react-native-paper";
import { Link } from "expo-router";
import Menu from "@/components/HBAppBar";

import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";

const TranslateAndRevise: React.FC = () => {
  function handleCardPress(item: string) {
    console.log("item pressed", item);
  }

  const navigation = useNavigation();
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
      <HBAppBar/>
      <HBScriptureCard/>
    </View>
  );
};

export default TranslateAndRevise;

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
