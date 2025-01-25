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
import { ExegeticalNote } from "@/interfaces/appInterfaces";
import PhraseDialog from "./PhraseDialog";
import buildPassage from "@/helpers/BuildPassage";

const HBOverviewCard: React.FC = () => {
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
    disableAudio,
  } = useAppContext();

  var tokenizedPassage: string = "";

  const [exegeticalDialogVisible, setExegeticalDialogVisible] = useState(false);
  const [highlightedPhrases, setHighlightedPhrases] = useState<any[]>([]);
  const [highlightedPassage, setHighlightedPassage] = useState<String>("");

  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(1);
  const [exegeticalDialogNote, setExegeticalDialogNote] =
    useState<ExegeticalNote>({
      words: "",
      BEN: "",
      parallelRef: "",
      comment: "",
      av: "",
    });

  useEffect(() => {
    if (bookNotes === null || bookNotes === undefined) {
      var modifiedPassage = bookOverview;
      setHighlightedPassage(modifiedPassage);
      return;
    }

    var phrases: any[] = [];

    var ndx = 0;

    tokenizedPassage = bookOverview;

    bookNotes.map((note, index) => {
      tokenizedPassage = tokenizedPassage.replace(
        note.words,
        "<<<~pndx~" + index + "<<<"
      );

      phrases.push({
        words: note.words,
        index: index,
        BEN: note.BEN,
        parallelRef: note.parallelRef,
        comment: note.comment,
        av: note.av,
      });
    });

    setHighlightedPhrases(phrases);

    setHighlightedPassage(tokenizedPassage);
  }, [bookNotes]);

  const openExegeticalDialog = (ndx: number) => {
    setExegeticalDialogVisible(true);

    setExegeticalDialogNote(highlightedPhrases[ndx]);
  };

  const closeExegeticalDialog = (av: any) => {
    setExegeticalDialogVisible(false);

    if (av) {
      disableAudio();
    }
  };

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

  const splitText = highlightedPassage.split("<<<");

  const bookNotesTextElements: React.JSX.Element[] = buildPassage(
    splitText,
    opacity,
    highlightedPhrases,
    highlightedWords,
    openExegeticalDialog,
    () => {},
    setOpacity
  );

  return (
    <View>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ width: screenWidth }}
        
      >
        <View style={styles.container}>
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
              <View>
                <Text style={{ opacity }}>
                  {bookNotesTextElements.map((element) => {
                    return element;
                  })}
                </Text>
              </View>
            </Card.Content>
            <Card.Title
              titleVariant="titleMedium"
              title={t("Passage Overview", { lng: language })}
            />
            <Card.Content>
              <Text>{passageOverviewNL}</Text>

              {passageOverviewVideo.map((videoURI, index) => (
                <HBVideo key={index} videoURI={videoURI} />
              ))}
              {passageOverviewImages.map((imageURI, index) => (
                <View>
                  <Text>{"\n"}</Text>
                  <AutosizeImage
                    key={index}
                    screenWidth={screenWidth - 25}
                    source={{ uri: imageURI }}
                  />
                </View>
              ))}
              {passageOverviewAudio.map((audioURI, index) => (
                <AudioPlayer key={index} audioUri={[audioURI]} />
              ))}
            </Card.Content>

            <Card.Title
              titleVariant="titleMedium"
              title={t("Background Information", { lng: language })}
            />
            <Card.Content>
              <Text>{backgroundInfoNL}</Text>

              {backgroundInfoVideo.map((videoURI, index) => (
                <HBVideo key={index} videoURI={videoURI} />
              ))}
              {backgroundInfoImages.map((imageURI, index) => (
                <View>
                  <Text>{"\n"}</Text>
                  <AutosizeImage
                    key={index}
                    screenWidth={screenWidth - 25}
                    source={{ uri: imageURI }}
                  />
                </View>
              ))}
              {backgroundInfoAudio.map((audioURI, index) => (
                <AudioPlayer key={index} audioUri={[audioURI]} />
              ))}
            </Card.Content>

            <Card.Title
              titleVariant="titleMedium"
              title={t("Historical Context", { lng: language })}
            />
            <Card.Content>
              <Text>{historicalContextNL}</Text>

              {historicalContextVideo.map((videoURI, index) => (
                <HBVideo key={index} videoURI={videoURI} />
              ))}
              {historicalContextImages.map((imageURI, index) => (
                <View>
                  <Text>{"\n"}</Text>
                  <AutosizeImage
                    key={index}
                    screenWidth={screenWidth - 25}
                    source={{ uri: imageURI }}
                  />
                </View>
              ))}
              {historicalContextAudio.map((audioURI, index) => (
                <AudioPlayer key={index} audioUri={[audioURI]} />
              ))}
            </Card.Content>

            <Card.Title
              titleVariant="titleMedium"
              title={t("Prominent Themes", { lng: language })}
            />
            <Card.Content>
              <Text>{prominentThemesNL}</Text>

              {prominentThemesVideo.map((videoURI, index) => (
                <HBVideo key={index} videoURI={videoURI} />
              ))}
              {prominentThemesImages.map((imageURI, index) => (
                <View>
                  <Text>{"\n"}</Text>
                  <AutosizeImage
                    key={index}
                    screenWidth={screenWidth - 25}
                    source={{ uri: imageURI }}
                  />
                </View>
              ))}
              {prominentThemesAudio.map((audioURI, index) => (
                <AudioPlayer key={index} audioUri={[audioURI]} />
              ))}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <PhraseDialog
        closeExegeticalDialog={closeExegeticalDialog}
        exegeticalDialogNote={exegeticalDialogNote}
        exegeticalDialogVisible={exegeticalDialogVisible}
      />
    </View>
  );
};

export default HBOverviewCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50
  },

  title: {
    backgroundColor: "red",
  },
});
