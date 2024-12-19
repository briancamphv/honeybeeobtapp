import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect, FC } from "react";
import { Button, Text, View } from "react-native";
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

  const  FileCopyComplete  = async () => { 

    console.log("complete")
    
    const fileUri = FileSystem.documentDirectory + selectedFile!.name;
    const dest = fileUri.split(".zip")
    const dest2 = `${FileSystem.documentDirectory}`

    if (await fileExists(fileUri)) {

        console.log("fileExists in FileCopyComplete")

        unzipFile(fileUri, dest2);
        listFiles(dest2+ "/Jonah 1-2 2/audioVisual/");
      
    


    }
   

    return 


  }

  useEffect(() => {
    console.log("uri", selectedFile);
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
      <Button title="Select File" onPress={handleFileSelect} />
      {selectedFile && (
        <View>
          <Text>File Name: {selectedFile.name}</Text>
          <Text>File Type: {selectedFile.type}</Text>
          <Text>File Size: {selectedFile.size} bytes</Text>
        </View>
      )}
    </View>
  );
};

export default GetTemplate;
