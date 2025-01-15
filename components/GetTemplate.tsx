import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect, FC } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { listFiles } from "@/helpers/FileUtilies";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import ChaptersOfBible from "@/app/data/ChaptersOfBible";

import {
  copyAndWriteFile,
  unzipFile,
  fileExists,
  deleteFile,
} from "@/helpers/FileUtilies";

import * as FileSystem from "expo-file-system";

interface FileSelectionResult {
  uri: string;
  type: string;
  name: string;
  size: number;
}

interface GetTemplate {
  book: string;
  template: string;
  setBackGroundColor: (value: string) => void;
  setAreChaptersVisible: (value: boolean) => void;
  setAreBooksVisible: (value: boolean) => void;
  getMultiple: boolean;
}

const GetTemplate: React.FC<GetTemplate> = ({
  book,
  template,
  setBackGroundColor,
  setAreChaptersVisible,
  setAreBooksVisible,
  getMultiple = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileSelectionResult | null>(
    null
  );

  const [multipleFiles, setMultipleFiles] = useState<FileSelectionResult[]>([]);

  if (getMultiple) {
  }

  const navigation = useNavigation();
  const { t } = useTranslation();
  const { language, loadTemplate, setStep } = useAppContext();

  const [templatedDownloaded, setTemplatedDownloaded] =
    useState<boolean>(false);

  const recordDir = FileSystem.documentDirectory! + template;

  listFiles(recordDir).then((files) => {
    if (files.length > 0) {
      setTemplatedDownloaded(true);
      setBackGroundColor("lightgreen");
    }
  });

  const FileCopyComplete = async (fileUri: string) => {
    const dest = `${FileSystem.documentDirectory}`;

    if (await fileExists(fileUri)) {
      unzipFile(fileUri, dest).then(() => {
        deleteFile(fileUri);
        var nameArray = fileUri.split("/");
        var filename = nameArray[nameArray.length - 1];

        Alert.alert(
          t("Template", { lng: language }),
          t("You have successfully imported the template from ", {
            lng: language,
          }) +
            filename +
            "."
        );

        if (getMultiple) {
        } else {
          setStep("Translate");
          loadTemplate(template).then(() => {
            navigation.dispatch(DrawerActions.jumpTo("ScripturePager"));
          });
          setAreBooksVisible(true);
          setAreChaptersVisible(false);
        }
      });
    }

    setBackGroundColor("lightgreen");

    return;
  };

  useEffect(() => {
    if (selectedFile === null) {
      return;
    }

    if (!selectedFile!.name.includes(template)) {
      Alert.alert(
        t("Wrong Template", { lng: language }),
        t(
          "The template file you have selected to import does not match the template you picked",
          {
            lng: language,
          }
        ) + "."
      );

      return;
    }

    const fileUri = FileSystem.documentDirectory + selectedFile!.name;

    copyAndWriteFile(selectedFile!.uri, fileUri, FileCopyComplete);
  }, [selectedFile]);

  useEffect(() => {
    if (multipleFiles.length === 0 || multipleFiles === undefined) {
      return;
    }

    multipleFiles.map((item) => {
      if (ChaptersOfBible.includes(item.name.split(".")[0])) {
        var fileUri = FileSystem.documentDirectory + item.name;
        copyAndWriteFile(item.uri, fileUri, FileCopyComplete);
      }
    });
  }, [multipleFiles]);

  const handleFileSelect = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        // type: "application/octet-stream", // You can specify file types here
        type: "*/*", // You can specify file types here
        multiple: getMultiple, // Enable multiple file selection
      });

      if (!result.assets[0].canceled) {
        if (getMultiple) {
          setMultipleFiles(result.assets);
        } else {
          setSelectedFile({
            uri: result.assets[0].uri,
            type: result.assets[0].mimeType,
            name: result.assets[0].name,
            size: result.assets[0].size,
          });
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  if (!templatedDownloaded && !getMultiple) {
    return (
      <View>
        <IconButton
          icon="import"
          iconColor={"blue"}
          size={25}
          onPress={handleFileSelect}
        />
      </View>
    );
  } else if (getMultiple) {

    return (
      <TouchableOpacity onPress={handleFileSelect}>
        <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 8 }}>
          <IconButton icon="import" iconColor={"black"} size={24} />

          <Text style={styles.item}>
            {t("Template Bulk Import", { lng: language })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};

export default GetTemplate;

const styles = StyleSheet.create({
  item: {
    fontSize: 15,
  },
});
