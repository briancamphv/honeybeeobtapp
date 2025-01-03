import React from "react";
import { useEffect, useRef } from "react";

import { useAppContext } from "@/context/AppContext";

import { View, StyleSheet, SafeAreaView } from "react-native";

import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";

import AudioPlayer from "@/components/HBAudioPlayer";
import HBRecordBar from "@/components/HBRecordBar";

import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const TranslateAndRevise: React.FC = () => {
  const {
    incrementPageNumber,
    decrementPageNumber,
    imageURI,
    audioURI,
    passageText,
    title,
    notes,
    setStep,
  } = useAppContext();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const onGestureEvent = (event: any) => {
    // console.log("event",event)
    translateX.value = withSpring(event.translationX);
    //translateY.value = withSpring(event.translationY);
  };

  const navigation = useNavigation();
  const { t } = useTranslation();

  // listFiles(FileSystem.documentDirectory + template + "/audioVisual/");
  // fileExists(
  //   "file:///data/user/0/com.briancamphv.HoneyBeeOBTApp/files/Jonah 1-2 2/audioVisual/Jona 1 3.mp3"
  // ).then((val) => console.log(val));

  const onSwipe = (event: any) => {
    if (event.translationX < 0) {
      // Swipe right

      incrementPageNumber();
      translateX.value = 0;
      translateY.value = 0;
    } else {
      // Swipe left
      decrementPageNumber();
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector
        gesture={Gesture.Pan()
          .onChange(onGestureEvent)
          .onEnd(onSwipe)
          .runOnJS(true)}
      >
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              { flex: 1, justifyContent: "center", alignItems: "center" },
              animatedStyle,
            ]}
          >
            <HBAppBar />
            <HBScriptureCard
              imageURI={imageURI}
              passageText={passageText}
              title={title}
              notes={notes}
              audioURI={audioURI}
            />
            <HBRecordBar />
          </Animated.View>
        </SafeAreaView>
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
