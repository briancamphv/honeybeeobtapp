import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Menu from "@/components/HBAppBar";

import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";
import HBAudioPlayer from "@/components/HBAudioPlayer";
import HBRecordBar from "@/components/HBRecordBar";

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
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => console.log("swipe")}
        >
          <Text>Next Screen</Text>
        </TouchableOpacity>
      )}
    >
      <View>
        <HBAppBar />
        <HBScriptureCard />
        <HBAudioPlayer audioUri="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav" />
        <HBRecordBar/> 
      </View>
    </Swipeable>
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
