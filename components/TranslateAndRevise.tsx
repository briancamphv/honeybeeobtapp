import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from "@/context/AppContext";

import { View, StyleSheet } from "react-native";

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

import { scripture } from "../interfaces/appInterfaces";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";



const TranslateAndRevise: React.FC<scripture> = ({
  imageURI,
  audioURI,
  passageText,
  title,
  notes,
}) => {
  const {
    incrementPageNumber,
    decrementPageNumber,
    changePageNumber,
    setStep,
  } = useAppContext();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  //  useEffect(() => {
  //   if (pageNumber === null) return

  //   changePageNumber(pageNumber)
  //  },[pageNumber])

  //changePageNumber(pageNumber)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // transform: [
      //   { translateX: translateX.value },
      //   { translateY: translateY.value },
      // ],
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
    // if (event.translationY > 0) {
    //   console.log('Moving down');
    // } else if (event.translationY < 0) {
    //   console.log('Moving up');
    // }

    if (event.translationX < -100) {
      // Swipe right

      incrementPageNumber();
      translateX.value = 0;
      translateY.value = 0;
    } else if (event.translationX > 100) {
      // Swipe left
      decrementPageNumber();
      translateX.value = 0;
      translateY.value = 0;
    } else {
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    //   <GestureDetector
    //     gesture={Gesture.Pan()
    //       .onChange(onGestureEvent)
    //       .onEnd(onSwipe)
    //       .runOnJS(true)}
    //   >

    //  <Animated.View
    // style={[
    //   { flex: 1, justifyContent: "center", alignItems: "center" },
    //   animatedStyle,
    // ]}

    <SafeAreaView style={styles.container}>
      <View
        style={[
          { flex: Platform.OS === 'ios' ? .93 : 1, justifyContent: "center", alignItems: "center" },
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
      </View>
    </SafeAreaView>

    // </Animated.View>
    //   </GestureDetector>
    // </GestureHandlerRootView>
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
