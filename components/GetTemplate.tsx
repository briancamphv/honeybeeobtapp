import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect, FC } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import copyAndWriteFile from "@/helpers/CopyAndWriteFile";
import unzipFile from "@/helpers/UnzipFile";
import fileExists from "@/helpers/FileExists";
import listFiles from "@/helpers/ListFiles";

import * as FileSystem from "expo-file-system";

interface FileSelectionResult {
  uri: string;
  type: string;
  name: string;
  size: number;
}

const GetTemplate: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileSelectionResult | null>(
    null
  );

  const FileCopyComplete = async () => {
    const fileUri = FileSystem.documentDirectory + selectedFile!.name;
    const dest = fileUri.split(".zip");
    const dest2 = `${FileSystem.documentDirectory}`;

    if (await fileExists(fileUri)) {
      unzipFile(fileUri, dest2);
    }

    return;
  };

  useEffect(() => {
   
    if (selectedFile === null) {
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
};

export default GetTemplate;
