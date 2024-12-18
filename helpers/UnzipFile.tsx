import * as FileSystem from 'expo-file-system';
import { unzip } from 'react-native-zip-archive';

const unzipFile = async (archivePath:string, destinationPath:string): Promise<void> => {
  try {
    console.log("archivePath", archivePath)
    console.log("destinationPath", destinationPath)
    console.log("unzip", unzip)
    await unzip(archivePath, destinationPath);
    console.log('File unzipped successfully!');
  } catch (error) {
    console.error('Error unzipping file:', error);
  }
};

export default unzipFile;