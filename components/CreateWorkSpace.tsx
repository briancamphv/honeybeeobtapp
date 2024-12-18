import * as FileSystem from "expo-file-system";

const createFolder = async (folderName: string) => {
  var directory = FileSystem.documentDirectory + folderName;


  console.log("directory", directory);

  if (await _checkFolderExists(directory)) {
    console.log("directory exists", directory);
    return;
  }

  try {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    console.log("Folder created successfully:", directory);
  } catch (error) {
    console.error("Error creating folder:", error);
  }
};

const _checkFolderExists = async (directory: string) => {
  try {
    const info = await FileSystem.getInfoAsync(directory);
    return info.isDirectory;
  } catch (error) {
    console.error("Error checking folder:", error);
    return false;
  }
};

export default createFolder;
