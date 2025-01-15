import * as FileSystem from "expo-file-system";
import { listFiles } from "./FileUtilies";
import stripWordsofSpecialCharacters from "./StringFunctions";

const wordHasRecording = async (word: string): Promise<boolean> => {
  var recordDir =
    FileSystem.documentDirectory! +
    "/" +
    stripWordsofSpecialCharacters(word, ".,;") +
    "/";

  var files = await listFiles(recordDir);

  if (files.length === 0) {
    return true;
  } else {
    return false;
  }
};

export default wordHasRecording;
