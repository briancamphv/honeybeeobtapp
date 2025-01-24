import { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Image, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import AudioPlayer from "./HBAudioPlayer";
import { useAppContext } from "@/context/AppContext";

interface props {
  audioArray: string[];
  imageArray: string[];
  title:string,
  BEN:string,
}

const HBOralScriptureCard: React.FC<props> = ({ audioArray, imageArray, title, BEN }) => {
  const [imageURI, setImageURI] = useState<string>("");
  const [imageHeight, setImageHeight] = useState<number>(0);

  const {audioStop} = useAppContext()

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

  const progressCallBack = (status: string, index: number) => {
    if (status === "inProgress") {
      Image.getSize(imageArray[index], (imgWidth, imgHeight) => {
        const aspectRatio = imgHeight / imgWidth;
        const calculatedHeight = screenWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      });

      setImageURI(imageArray[index]);
    } else if (status === "finished") {
      Image.getSize(imageArray[0], (imgWidth, imgHeight) => {
        const aspectRatio = imgHeight / imgWidth;
        const calculatedHeight = screenWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      });

      setImageURI(imageArray[0]);
    }
  };

  useEffect(() => {
    if (imageArray.length === 0) return;

    Image.getSize(imageArray[0], (imgWidth, imgHeight) => {
      const aspectRatio = imgHeight / imgWidth;
      const calculatedHeight = screenWidth * aspectRatio;
      setImageHeight(calculatedHeight);
    });

    setImageURI(imageArray[0]);
  }, [imageArray, audioStop]);

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.card}
    >
      <View style={styles.card}>
        <Card mode="contained" style={{ backgroundColor: "#f0f0f0" }}>
          <View>
            {/* t= set to clear cache */}
            <Card.Cover
              // source={{ uri: imageURI + "?t=" + Date.now() }}
              source={{ uri: imageURI }}
              style={{ height: imageHeight }}
            />
            <Card.Content>
              <View>
                <Text variant="titleLarge">{title}</Text>
                <Text style={{color: "red", fontStyle: "italic"}}  variant="titleMedium">{BEN}</Text>
              </View>
            </Card.Content>
          </View>

          <AudioPlayer
            audioUri={audioArray}
            progressCallBack={progressCallBack}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

export default HBOralScriptureCard;

const styles = StyleSheet.create({
  card: {},

  title: {
    backgroundColor: "red",
  },
});
