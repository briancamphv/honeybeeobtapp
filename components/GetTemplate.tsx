import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect, FC } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { listFiles } from "@/helpers/FileUtilies";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";

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
}

const GetTemplate: React.FC<GetTemplate> = ({
  book,
  template,
  setBackGroundColor,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileSelectionResult | null>(
    null
  );

  const { t } = useTranslation();
  const { language } = useAppContext();

  const [templatedDownloaded, setTemplatedDownloaded] =
    useState<boolean>(false);

  const recordDir = FileSystem.documentDirectory! + template;

  listFiles(recordDir).then((files) => {
    if (files.length > 0) {
      setTemplatedDownloaded(true);
    }
  });

  const FileCopyComplete = async () => {
    const fileUri = FileSystem.documentDirectory + selectedFile!.name;
    const dest = `${FileSystem.documentDirectory}`;

    if (await fileExists(fileUri)) {
      unzipFile(fileUri, dest).then(() => deleteFile(fileUri));
      setBackGroundColor("lightgreen");
    }

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
          "The template file you have selected to import does not match the template you selected",
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

  const handleFileSelect = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        // type: "application/octet-stream", // You can specify file types here
        type: "*/*", // You can specify file types here
      });

      if (!result.assets[0].canceled) {
        setSelectedFile({
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].name,
          size: result.assets[0].size,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  if (!templatedDownloaded) {
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
  }
};

export default GetTemplate;
