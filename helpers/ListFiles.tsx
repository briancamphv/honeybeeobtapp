import * as FileSystem from "expo-file-system";

async function listFiles(directoryUri: string): Promise<void> {
  try {
    const files = await FileSystem.readDirectoryAsync(directoryUri);
    console.log("Files in directory:", files);
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}

export default listFiles;
