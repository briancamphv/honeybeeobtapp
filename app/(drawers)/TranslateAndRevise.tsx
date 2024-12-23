import React from "react";
import { useEffect, useRef } from "react";

import { useAppContext } from "@/context/AppContext";

import { View, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";
// import HBAudioPlayer from "@/components/HBAudioPlayer";
import AudioPlayer from "@/components/HBAudioPlayer";
import HBRecordBar from "@/components/HBRecordBar";

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

const TranslateAndRevise: React.FC = () => {
  

  const {
    loadTemplate,
    incrementPageNumber,
    decrementPageNumber,
    imageURI,
    audioURI,
    passageText,
    title,
    notes,
    templatePassages,
  } = useAppContext();

  useEffect(() => {
    loadTemplate("Jonah 1-2 2");
  }, []); // Empty dependency array

  function handleCardPress(item: string) {
    console.log("item pressed", item);
  }

  const navigation = useNavigation();
  const { t } = useTranslation();

  var template = "Jonah 1-2 2";

  // listFiles(FileSystem.documentDirectory + template + "/audioVisual/");
  // fileExists(
  //   "file:///data/user/0/com.briancamphv.HoneyBeeOBTApp/files/Jonah 1-2 2/audioVisual/Jona 1 3.mp3"
  // ).then((val) => console.log(val));

  const onSwiped = (direction: string) => {
    console.log("swiped", direction);

    if (direction === "right") {
      console.log("swipedincrement", direction);

      incrementPageNumber();
    }

    if (direction === "left") {
      console.log("swipeddecrement", direction);

      decrementPageNumber();
    }
  };

  const onSwipe = (event: any) => {
  
    if (event.translationX < 0) {
      // Swipe right
      incrementPageNumber();
      console.log("Swiped right!");
    } else {
      // Swipe left
      console.log("Swiped left!");
      decrementPageNumber();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={Gesture.Pan().onEnd(onSwipe)}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <HBAppBar />
          <HBScriptureCard
            imageURI={imageURI}
            passageText={passageText}
            title={title}
            notes={notes}
          />
          <AudioPlayer audioUri={audioURI}/>
          <HBRecordBar />
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default TranslateAndRevise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    margin: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
  item: {
    width: 300,
    height: 100,
    backgroundColor: "#f0f",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightAction: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    animationDuration: "0s",
  },
});
