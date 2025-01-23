import React, { useState } from "react";

import { listFiles } from "@/helpers/FileUtilies";
import { View } from "react-native";
import DownloadTemplate from "./DownloadTemplate";
import GetTemplate from "./GetTemplate";
import { Card, Title } from "react-native-paper";

import { StyleSheet } from "react-native";

import * as FileSystem from "expo-file-system";
import { useNavigation } from "expo-router";

import { useTranslation } from "react-i18next";

import { useAppContext } from "@/context/AppContext";
import { DrawerActions } from "@react-navigation/native";
import { Alert } from "react-native";
import { useTheme } from "react-native-paper";

interface ChapterCards {
  book: string;
  template: string;
  index: number;
  language: string;
  setAreChaptersVisible: (value: boolean) => void;
  setAreBooksVisible: (value: boolean) => void;
}

const ChapterCards: React.FC<ChapterCards> = ({
  book,
  template,
  index,
  language,
  setAreChaptersVisible,
  setAreBooksVisible,
}) => {
  const [templatedDownloaded, setTemplatedDownloaded] =
    useState<boolean>(false);

  const theme = useTheme();

  const [backGroundColor, setBackGroundColor] = useState<string>(
    theme.colors.surface
  );

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { setStep, loadTemplate } = useAppContext();

  const recordDir = FileSystem.documentDirectory! + template;

  listFiles(recordDir).then((files) => {
    if (files.length > 0) {
      setBackGroundColor("lightgreen");
      setTemplatedDownloaded(true);
    } else {
      setBackGroundColor(theme.colors.surface);
      setTemplatedDownloaded(false);
    }
  });

  function handleChapterPress(item: string) {
    if (!templatedDownloaded) {
      Alert.alert(
        t("Missing Template", { lng: language }),
        t("You need to first download or import this template", {
          lng: language,
        }) + "."
      );
      return;
    }

    setStep("translate");
    loadTemplate(item).then(() => {
      navigation.dispatch(DrawerActions.jumpTo("ScripturePager"));
      setAreChaptersVisible(false);
      setAreBooksVisible(true);
    });
  }

  return (
    <>
      <Card
        style={[styles.chapters, { backgroundColor: backGroundColor }]}
        onPress={() => handleChapterPress(template)}
      >
        <Card.Content>
          <View style={styles.container}>
            <Title style={styles.chapterTitle}>
              {t(template, { lng: language })}
            </Title>
          </View>
          <View style={styles.iconContainer}>
            <DownloadTemplate book={book} template={template} />
            <GetTemplate
              book={book}
              template={template}
              setBackGroundColor={setBackGroundColor}
              setAreChaptersVisible = {setAreChaptersVisible}
              setAreBooksVisible = {setAreBooksVisible}
              getMultiple={false}
            />
          </View>
        </Card.Content>
      </Card>
    </>
  );
};
export default ChapterCards;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  books: {
    width: 120, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
  },
  chapters: {
    width: 175, // Adjust the width as needed
    height: 120, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
    alignContent: "center",
  },
  container: {
    alignItems: "center",
    wordWrap: "2",
  },
  bookTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
