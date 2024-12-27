const checkFileType = (filename: string) => {
  const lowerCaseFilename = filename.toLowerCase();

  if (
    lowerCaseFilename.endsWith(".jpg") ||
    lowerCaseFilename.endsWith(".jpeg") ||
    lowerCaseFilename.endsWith(".png") ||
    lowerCaseFilename.endsWith(".tiff") ||
    lowerCaseFilename.endsWith(".svg") ||
    lowerCaseFilename.endsWith(".gif")
  ) {
    return "image";
  } else if (
    lowerCaseFilename.endsWith(".mp4") ||
    lowerCaseFilename.endsWith(".mov") ||
    lowerCaseFilename.endsWith(".avi")
  ) {
    return "video";
  } else if (
    lowerCaseFilename.endsWith(".mp3") ||
    lowerCaseFilename.endsWith(".wav")
  ) {
    return "audio";
  } else {
    return "other";
  }
};

export default checkFileType;
