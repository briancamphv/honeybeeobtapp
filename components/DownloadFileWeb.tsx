import * as FileSaver from 'file-saver';

const downloadFileWeb = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    FileSaver.saveAs(blob, fileName);
    console.log('File downloaded successfully!');
  } catch (error) {
    console.error('Error downloading file:', error);
  }
};

export default downloadFileWeb