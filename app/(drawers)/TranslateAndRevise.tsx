import React from "react";
import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Menu from "@/components/HBAppBar";
import loadTemplate from "@/helpers/LoadTemplate";
import listFiles from "@/helpers/ListFiles";
import fileExists from "@/helpers/FileExists";

import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";
//import HBAudioPlayer from "@/components/HBAudioPlayer";
import AudioPlayer from "@/components/HBAudioPlayer";
import HBRecordBar from "@/components/HBRecordBar";

import * as FileSystem from "expo-file-system";

const TranslateAndRevise: React.FC = () => {
  function handleCardPress(item: string) {
    console.log("item pressed", item);
  }

  const [audioURI, setAudioURI] = useState<string>("");
  const [imageURI, setImageURI] = useState<string>("");
  const [passageText, setPassageText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const navigation = useNavigation();
  const { t } = useTranslation();

  var template = "Jonah 1-2 2";

  loadTemplate("Jonah 1-2 2").then((json) => {
    setAudioURI(
      FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        json.passages[1].audio
    );

    setImageURI(
      FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        json.passages[1].image
    );

    setPassageText(json.passages[1].text);
    setTitle(json.passages[1].book + " " +  json.passages[1].chapter + ": " + json.passages[1].verses)
  });

  listFiles(FileSystem.documentDirectory + template + "/audioVisual/");
  fileExists(
    "file:///data/user/0/com.briancamphv.HoneyBeeOBTApp/files/Jonah 1-2 2/audioVisual/Jona 1 3.mp3"
  ).then((val) => console.log(val));


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
        <HBScriptureCard imageURI={imageURI} passageText={passageText} title={title} />
        {/* <HBAudioPlayer audioUri="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav" /> */}
        <AudioPlayer audioUri={audioURI} />
        <HBRecordBar />
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
