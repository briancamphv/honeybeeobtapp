import * as FileSystem from "expo-file-system";
import fileExists from "./FileExists";

const copyAndWriteFile = async (
  sourceUri: string,
  destinationPath: string,
  FileCopyComplete: any
): Promise<void> => {
  try {

    await FileSystem.copyAsync({ from: sourceUri, to: destinationPath });
    console.log("File downloaded and written to:", destinationPath),fileExists(destinationPath);
    FileCopyComplete();
  } catch (error) {
    console.error("Error downloading and writing file:", error);
    throw error;
  }
};
export default copyAndWriteFile;
