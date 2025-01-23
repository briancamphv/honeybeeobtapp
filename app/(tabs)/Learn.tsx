import { useAppContext } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { View, Platform, StyleSheet, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import HBAppBar from "@/components/HBAppBar";
import getAppBarProps from "@/helpers/GetAppBarProps";
import AudioPlayer from "@/components/HBAudioPlayer";

const Learn: React.FC = () => {
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
    passageText
  } = useAppContext();

  const { width } = useWindowDimensions();

  const appbarProps = getAppBarProps("learn");

  


  const [image, setImage] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [audioArray, setAudioArray] = useState<string[]>([])
  const [imageArray, setImageArray] = useState<string[]>([])

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

  useEffect(() => {

    if (passageText === null) {
      return
    }

    getPage(0).then((scripture) => {
    

      setAudioArray((prevArray) => [...prevArray,scripture.audioURI])
      setImageArray((prevArray) => [...prevArray,scripture.imageURI])
     
  
      Image.getSize(scripture.imageURI, (imgWidth, imgHeight) => {
        const aspectRatio = imgHeight / imgWidth;
        const calculatedHeight = screenWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      });
  

      setImage(scripture.imageURI);
    });
  
    getPage(1).then((scripture) => {
      setAudioArray((prevArray) => [...prevArray,scripture.audioURI])
      setImageArray((prevArray) => [...prevArray,scripture.imageURI])
    });
  
    getPage(2).then((scripture) => {
      setAudioArray((prevArray) => [...prevArray,scripture.audioURI])
      setImageArray((prevArray) => [...prevArray,scripture.imageURI])
    });
  
    getPage(3).then((scripture) => {
      setAudioArray((prevArray) => [...prevArray,scripture.audioURI])
      setImageArray((prevArray) => [...prevArray,scripture.imageURI])
    });
  },[passageText])

  

  const progressCallBack = (status: string, index: number) => {
    if (status === "inProgress") {
      Image.getSize(imageArray[index], (imgWidth, imgHeight) => {
        const aspectRatio = imgHeight / imgWidth;
        const calculatedHeight = screenWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      });

      setImage(imageArray[index]);

     
    }
  };

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
        {image ? (
          <Image
            source={{ uri: image}}
            height={imageHeight}
            width={screenWidth}
          ></Image>
        ) : (
          ""
        )}
        <Text>{bookOverview}</Text>
        <AudioPlayer
          audioUri={audioArray}
          progressCallBack={progressCallBack}
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
