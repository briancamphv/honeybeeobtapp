import React, { useState, useEffect, FC } from "react";
import { IconButton, Text } from "react-native-paper";
import { listFiles } from "@/helpers/FileUtilies";
import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";

interface FileSelectionResult {
  uri: string;
  type: string;
  name: string;
  size: number;
}

interface DownloadTemplate {
  book: string;
  template: string;
}

const DownloadTemplate: React.FC<DownloadTemplate> = ({ book, template }) => {
  const [templatedDownloaded, setTemplatedDownloaded] =
    useState<boolean>(false);

  const recordDir = FileSystem.documentDirectory! + template;

  listFiles(recordDir).then((files) => {
    if (files.length > 0) {
      setTemplatedDownloaded(true);
    } else {
      setTemplatedDownloaded(false);
    }
  });

  if (!templatedDownloaded) {
    return (
      <>
        <IconButton 
          icon="download"
          iconColor={"blue"}
          size={25}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Download is not currently working, use Import instead."
            )
          }
        />
      </>
    );
  } else {
    return ("")
  }
};

export default DownloadTemplate;
