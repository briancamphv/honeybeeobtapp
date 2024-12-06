import { Image, StyleSheet, Platform } from "react-native";
import { useEffect } from "react";
//import { getLocales } from 'react-native-localize';

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import HBWorkFlowTitleBar from "@/components/HBWorkFlowTitleBar";
import HBWorkFlowCard from "@/components/HBWorkFlowCard";
import HBAudioPlayer from "@/components/HBAudioPlayer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import i18n from "../translate/i18n";
import { useTranslation } from 'react-i18next';

import Login from "../screens/login";
import BibleBookList from "../screens/booksofbible";


export default function HomeScreen() {
  const recording = {
    uri: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3",
  };
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "tomato",
      secondary: "yellow",
    },
  };

  function help() {
    console.log("help");
  }

  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
    <PaperProvider theme={theme}>
      {/* <Login/> */}
      <BibleBookList/>
    </PaperProvider>
    </I18nextProvider>
  )

  // return (
  //   <I18nextProvider i18n={i18n}>
  //     <PaperProvider theme={theme}>
  //       <HBWorkFlowTitleBar title={t('learn')} help={help} />
  //       <HBWorkFlowCard />
  //       <HBAudioPlayer recording={recording} />

  //       <ParallaxScrollView
  //         headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
  //         headerImage={
  //           <Image
  //             source={require("@/assets/images/partial-react-logo.png")}
  //             style={styles.reactLogo}
  //           />
  //         }
  //       >
  //         <ThemedView style={styles.titleContainer}>
  //           <ThemedText type="title">Welcome!</ThemedText>
  //           <HelloWave />
  //         </ThemedView>
  //         <ThemedView style={styles.stepContainer}>
  //           <ThemedText type="subtitle">Step 1: Try it</ThemedText>
  //           <ThemedText>
  //             Edit{" "}
  //             <ThemedText type="defaultSemiBold">
  //               app/(tabs)/index.tsx
  //             </ThemedText>{" "}
  //             to see changes. Press{" "}
  //             <ThemedText type="defaultSemiBold">
  //               {Platform.select({
  //                 ios: "cmd + d",
  //                 android: "cmd + m",
  //                 web: "F12",
  //               })}
  //             </ThemedText>{" "}
  //             to open developer tools.
  //           </ThemedText>
  //         </ThemedView>
  //         <ThemedView style={styles.stepContainer}>
  //           <ThemedText type="subtitle">Step 2: Explore</ThemedText>
  //           <ThemedText>
  //             Tap the Explore tab to learn more about what's included in this
  //             starter app.
  //           </ThemedText>
  //         </ThemedView>
  //         <ThemedView style={styles.stepContainer}>
  //           <ThemedText type="subtitle">Step 3: Get a fresh start!!</ThemedText>
  //           <ThemedText>
  //             When you're ready, run{" "}
  //             <ThemedText type="defaultSemiBold">
  //               npm run reset-project
  //             </ThemedText>{" "}
  //             to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
  //             directory. This will move the current{" "}
  //             <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
  //             <ThemedText type="defaultSemiBold">app-example</ThemedText>.
  //           </ThemedText>
  //         </ThemedView>
  //       </ParallaxScrollView>
  //     </PaperProvider>
  //   </I18nextProvider>
  // );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
