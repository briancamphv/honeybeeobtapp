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
    console.log("directoryUri",directoryUri)
    console.error("Error reading directory:", error);
    return [];
  }
}

export const createDirectory = async (directoryName:string) => {
  try {

   

    const directoryUri =  directoryName; 
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true }); 
    console.log(`Directory created successfully at: ${directoryUri}`);
  } catch (error) {
    console.error('Error creating directory:', error);
  }
};

export const createFileFromString = async (filePath: string, fileContent:string) => {
  try {
    await FileSystem.writeAsStringAsync(filePath, fileContent);
    console.log(`File created successfully at: ${filePath}`);
  } catch (error) {
    console.error('Error creating file:', error);
  }
};

const fileUtilities = () => {
    
    console.log("Contains several file utility functions")

}

export default fileUtilities; 

