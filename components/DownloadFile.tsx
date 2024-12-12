import * as FileSystem from 'expo-file-system';
import * as Fetch from 'expo/fetch';

const downloadFile = async (fileUrl: string, localFilePath: string) => {
  try {
    const response = await Fetch.fetch(fileUrl);
    const fileUri = FileSystem.documentDirectory + localFilePath;
      
    console.log("FileSystem.documentDirectory",FileSystem.documentDirectory)

    if (response.status === 200) {
      const { uri } = await FileSystem.downloadAsync(
        response.url,
        fileUri
      );
      console.log('File downloaded to:', uri);
    } else {
      console.error('Error downloading file:', response.status);
    }
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export default downloadFile

