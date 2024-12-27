import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";

interface AutosizeImage {
  source: { uri: string };
  screenWidth: number;
}

const AutosizeImage: React.FC<AutosizeImage> = ({ source, screenWidth }) => {
  const [imageHeight, setImageHeight] = useState<number>(0);

  useEffect(() => {
    Image.getSize(source.uri, (imgWidth, imgHeight) => {
      const aspectRatio = imgHeight / imgWidth;
      const calculatedHeight = screenWidth * aspectRatio;
      setImageHeight(calculatedHeight);
    });
  }, [source]);

  return (
    <Image
      source={source}
      style={{
        width: screenWidth,
        height: imageHeight,
        resizeMode: "contain",
      }}
    />
  );
};

const styles = StyleSheet.create({
  // Add any custom styles here
});

export default AutosizeImage;
