import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HBAppBar from "@/components/HBAppBar";
import HBOralScriptureCard from "@/components/HBOralScriptureCard";
import getAppBarProps from "@/helpers/GetAppBarProps";
import * as FileSystem from "expo-file-system";
import HBRecordBar from "@/components/HBRecordBar";
import stripWordsofSpecialCharacters from "@/helpers/StringFunctions";

interface props { 
  section?:number
}

const Learn: React.FC<props> = ({section}) => {
  const {
    bookOverview,
    bookNotes,
    templateTitle,
    passageOverview,
    passageOverviewAV,
    historicalContext,
    historicalContextAV,
    backgroundInfo,
    backgroundInfoAV,
    prominentThemes,
    prominentThemesAV,
    getPage,
    getSection,
    passageText,
    template,
    translationStep,
  } = useAppContext();

  const avdir = FileSystem.documentDirectory + template + "/audioVisual/";



  const appbarProps = getAppBarProps("learn");

  const [audioArray, setAudioArray] = useState<string[]>([]);
  const [imageArray, setImageArray] = useState<string[]>([]);

  var { title, passages, BEN } = getSection(section!);


  const recordDir =
    FileSystem.documentDirectory! +
    template +
    "/" +
    stripWordsofSpecialCharacters(title, ":") +
    "/";

  useEffect(() => {
    if (passageText === null) {
      return;
    }

    var passageAudio: string[] = [];
    var passageImages: string[] = [];

    {
      passages.map((element) => {
        passageAudio.push(avdir + element.audio);
        passageImages.push(avdir + element.image);
      });
    }

    setImageArray(passageImages);
    setAudioArray(passageAudio);
  }, [passageText]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            flex: Platform.OS === "ios" ? 0.93 : 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <HBAppBar {...appbarProps} />
        <HBOralScriptureCard
          audioArray={audioArray}
          imageArray={imageArray}
          title={title}
          BEN={BEN}
        ></HBOralScriptureCard>
        <HBRecordBar
          recordDir={recordDir}
          translationStep={translationStep}
          screenWidthAdj={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default Learn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
