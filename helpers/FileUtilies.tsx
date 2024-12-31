import * as FileSystem from "expo-file-system";

import { unzip } from "react-native-zip-archive";

export const unzipFile = async (
  archivePath: string,
  destinationPath: string
): Promise<void> => {
  try {
    console.log("archivePath", archivePath);
    console.log("destinationPath", destinationPath);
    console.log("unzip", unzip);
    await unzip(archivePath, destinationPath);
    console.log("File unzipped successfully!");
  } catch (error) {
    console.error("Error unzipping file:", error);
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    console.log("file exist",fileInfo.exists)
    return fileInfo.exists;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

export async function deleteFile(fileUri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(fileUri);
  } catch (error) {
    console.error("Error downloading and writing file:", error);
    throw error;
  }
}

export const copyAndWriteFile = async (
  sourceUri: string,
  destinationPath: string,
  FileCopyComplete: any
): Promise<void> => {
  try {
    await FileSystem.copyAsync({ from: sourceUri, to: destinationPath });
    FileCopyComplete();
  } catch (error) {
    console.error("Error downloading and writing file:", error);
    throw error;
  }
};

export async function listFiles(directoryUri: string): Promise<string[]> {
  try {
    const files = await FileSystem.readDirectoryAsync(directoryUri);
    return files;
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

const fileUtilities = () => {
    
    console.log("Contains several file utility functions")

}

export default fileUtilities; 

