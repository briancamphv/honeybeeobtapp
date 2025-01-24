import { Card, Text } from "react-native-paper";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useAppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";
import { replaceExceptFirst } from "@/helpers/StringFunctions";
import checkFileType from "@/helpers/FileTypeCheck";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import HBVideo from "./HBVideo";
import AutosizeImage from "@/helpers/AutoSizeImage";
import AudioPlayer from "./HBAudioPlayer";

const HBOverviewCard = () => {
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
    passageText,
    template,
    translationStep,
    language,
  } = useAppContext();

  var assetDir = FileSystem.documentDirectory + template + "/audioVisual/";

  const { t } = useTranslation();

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

  const [backgroundInfoAudio, setBackgroundInfoAudio] = useState<string[]>([]);
  const [backgroundInfoVideo, setBackgroundInfoVideo] = useState<string[]>([]);
  const [backgroundInfoImages, setBackgroundInfoImages] = useState<string[]>(
    []
  );

  const [passageOverviewAudio, setpassageOverviewAudio] = useState<string[]>(
    []
  );
  const [passageOverviewVideo, setpassageOverviewVideo] = useState<string[]>(
    []
  );
  const [passageOverviewImages, setpassageOverviewImages] = useState<string[]>(
    []
  );

  const [historicalContextAudio, sethistoricalContextAudio] = useState<
    string[]
  >([]);
  const [historicalContextVideo, sethistoricalContextVideo] = useState<
    string[]
  >([]);
  const [historicalContextImages, sethistoricalContextImages] = useState<
    string[]
  >([]);

  const [prominentThemesAudio, setprominentThemesAudio] = useState<string[]>(
    []
  );
  const [prominentThemesVideo, setprominentThemesVideo] = useState<string[]>(
    []
  );
  const [prominentThemesImages, setprominentThemesImages] = useState<string[]>(
    []
  );

  const bookOverviewNL = replaceExceptFirst(bookOverview, "●", "\n\n●");
  const passageOverviewNL = replaceExceptFirst(passageOverview, "●", "\n\n●");

  const historicalContextNL = replaceExceptFirst(
    historicalContext,
    "●",
    "\n\n●"
  );
  const backgroundInfoNL = replaceExceptFirst(backgroundInfo, "●", "\n\n●");
  const prominentThemesNL = replaceExceptFirst(prominentThemes, "●", "\n\n●");

  useEffect(() => {
    if (backgroundInfoAV) {
      if (template === null) {
        return;
      }

      var images: string[] = [];
      var audio: string[] = [];
      var video: string[] = [];

      backgroundInfoAV.map((av) => {
        switch (checkFileType(av)) {
          case "video":
            video.push(assetDir + av);

            break;

          case "image":
            images.push(assetDir + av);

            break;

          case "audio":
            audio.push(assetDir + av);

            break;

          default:
            break;
        }
      });

      setBackgroundInfoAudio(audio);
      setBackgroundInfoVideo(video);
      setBackgroundInfoImages(images);
    }

    if (passageOverviewAV) {
      if (template === null) {
        return;
      }

      var images: string[] = [];
      var audio: string[] = [];
      var video: string[] = [];

      passageOverviewAV.map((av) => {
        switch (checkFileType(av)) {
          case "video":
            video.push(assetDir + av);

            break;

          case "image":
            images.push(assetDir + av);

            break;

          case "audio":
            audio.push(assetDir + av);

            break;

          default:
            break;
        }
      });

      setpassageOverviewAudio(audio);
      setpassageOverviewVideo(video);
      setpassageOverviewImages(images);
    }

    if (historicalContextAV) {
      if (template === null) {
        return;
      }

      var images: string[] = [];
      var audio: string[] = [];
      var video: string[] = [];

      historicalContextAV.map((av) => {
        switch (checkFileType(av)) {
          case "video":
            video.push(assetDir + av);

            break;

          case "image":
            images.push(assetDir + av);

            break;

          case "audio":
            audio.push(assetDir + av);

            break;

          default:
            break;
        }
      });

      sethistoricalContextAudio(audio);
      sethistoricalContextVideo(video);
      sethistoricalContextImages(images);
    }

    if (prominentThemesAV) {
      if (template === null) {
        return;
      }

      var images: string[] = [];
      var audio: string[] = [];
      var video: string[] = [];

      prominentThemesAV.map((av) => {
        switch (checkFileType(av)) {
          case "video":
            video.push(assetDir + av);

            break;

          case "image":
            images.push(assetDir + av);

            break;

          case "audio":
            audio.push(assetDir + av);

            break;

          default:
            break;
        }
      });

      setprominentThemesAudio(audio);
      setprominentThemesVideo(video);
      setprominentThemesImages(images);
    }
  }, [template]);

  return (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      style={styles.card}
    >
      <View style={styles.card}>
        <Card mode="contained" style={{ backgroundColor: "#f0f0f0" }}>
          <Card.Title
            titleVariant="titleLarge"
            title={t(templateTitle, { lng: language })}
          />
          <Card.Title
            titleVariant="titleMedium"
            title={t("Book Overview", { lng: language })}
          />
          <Card.Content>
            <Text>{bookOverviewNL}</Text>
          </Card.Content>
          <Card.Title
            titleVariant="titleMedium"
            title={t("Passage Overview", { lng: language })}
          />
          <Card.Content>
            <Text>{passageOverviewNL}</Text>
          </Card.Content>

          {passageOverviewVideo.map((videoURI, index) => (
            <HBVideo key={index} videoURI={videoURI} />
          ))}
          {passageOverviewImages.map((imageURI, index) => (
            <AutosizeImage
              screenWidth={screenWidth}
              source={{ uri: imageURI }}
            />
          ))}
          {passageOverviewAudio.map((audioURI, index) => (
            <AudioPlayer audioUri={[audioURI]} />
          ))}

          <Card.Title
            titleVariant="titleMedium"
            title={t("Background Information", { lng: language })}
          />
          <Card.Content>
            <Text>{backgroundInfoNL}</Text>
          </Card.Content>

          {backgroundInfoVideo.map((videoURI, index) => (
            <HBVideo key={index} videoURI={videoURI} />
          ))}
          {backgroundInfoImages.map((imageURI, index) => (
            <AutosizeImage
              screenWidth={screenWidth}
              source={{ uri: imageURI }}
            />
          ))}
          {backgroundInfoAudio.map((audioURI, index) => (
            <AudioPlayer audioUri={[audioURI]} />
          ))}

          <Card.Title
            titleVariant="titleMedium"
            title={t("Historical Context", { lng: language })}
          />
          <Card.Content>
            <Text>{historicalContextNL}</Text>
          </Card.Content>

          {historicalContextVideo.map((videoURI, index) => (
            <HBVideo key={index} videoURI={videoURI} />
          ))}
          {historicalContextImages.map((imageURI, index) => (
            <AutosizeImage
              screenWidth={screenWidth}
              source={{ uri: imageURI }}
            />
          ))}
          {historicalContextAudio.map((audioURI, index) => (
            <AudioPlayer audioUri={[audioURI]} />
          ))}

          <Card.Title
            titleVariant="titleMedium"
            title={t("Prominent Themes", { lng: language })}
          />
          <Card.Content>
            <Text>{prominentThemesNL}</Text>
          </Card.Content>

          {prominentThemesVideo.map((videoURI, index) => (
            <HBVideo key={index} videoURI={videoURI} />
          ))}
          {prominentThemesImages.map((imageURI, index) => (
            <AutosizeImage
              screenWidth={screenWidth}
              source={{ uri: imageURI }}
            />
          ))}
          {prominentThemesAudio.map((audioURI, index) => (
            <AudioPlayer audioUri={[audioURI]} />
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

export default HBOverviewCard;

const styles = StyleSheet.create({
  card: {},

  title: {
    backgroundColor: "red",
  },
});
