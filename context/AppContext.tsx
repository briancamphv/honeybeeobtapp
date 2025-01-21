import React, { createContext, useContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useAssets } from "expo-asset";
import {
  fileExists,
  readJSONData,
  createFileFromJSON,
} from "@/helpers/FileUtilies";
import stripWordsofSpecialCharacters from "@/helpers/StringFunctions";
import { scripture } from "@/interfaces/appInterfaces";
import AudioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";

import { listFiles } from "@/helpers/FileUtilies";
import { WordNote } from "@/interfaces/appInterfaces";

import { appState } from "@/interfaces/appInterfaces";

const audioPlayer = new AudioRecorderPlayer();

// Define the type for the context values

interface AppContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  loadTemplate: (template: string) => Promise<any>;
  incrementPageNumber: () => void;
  decrementPageNumber: () => void;
  changePageNumber: (pgNbr: number) => void;
  enableAudio: () => void;
  disableAudio: () => void;
  isPlayRecording: () => void;
  isNotPlayRecording: () => void;
  setStep: (step: string) => void;
  languageSwitcher: (lng: string) => void;
  changeImage: (uri: string) => void;
  revertImage: () => void;
  getPage: (pageNumber: number) => Promise<scripture>;
  getNumberOfPages: () => number;
  setHasRecording: (key: string, hasRecording: boolean) => void;
  setPlayingDraft: (state:boolean) => void;
  isPlayingDraft: boolean;
  audioPlayer: AudioRecorderPlayer;
  language: string;
  translationStep: string;
  template: string;
  playRecording: boolean;
  audioStop: boolean;
  audioURI: string;
  imageURI: string;
  passageText: string;
  notes: any;
  title: string;
  templatePassages: any[];
  en_wordData: Map<string, WordNote>;
  fr_wordData: Map<string, WordNote>;
  wordData: Map<string, WordNote>;
}

// Create the context
const AppContext = createContext<AppContextType | null>(null);

// Create a custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
};

// Create the provider component
const AppProvider: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [count, setCount] = useState(0);

  const [translationStep, setTranslationStep] = useState<string>("");

  const [audioURI, setAudioURI] = useState<string>("");
  const [imageURI, setImageURI] = useState<string>("");
  const [passageText, setPassageText] = useState<string>("");
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [template, setTemplate] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [isPlayingDraft, setIsPlayingDraft] = useState<boolean>(false);

  const [audioStop, setAudioStop] = useState<boolean>(false);
  const [playRecording, setPlayRecording] = useState<boolean>(false);

  const [templateJSON, setTemplateJSON] = useState<any>({});
  const [templatePassages, setTemplatePassages] = useState<any>([]);

  const [en_wordData, setEN_WordData] = useState<Map<string, WordNote>>(
    new Map()
  );
  const [fr_wordData, setFR_WordData] = useState<Map<string, WordNote>>(
    new Map()
  );

  const fileAppStateURI = FileSystem.documentDirectory! + "appState.json";

  const [wordData, setWordData] = useState<Map<string, WordNote>>(new Map());

  const [assets, error] = useAssets([
    require("../assets/data/en_wordlinks.tsv"),
    require("../assets/data/fr_wordlinks.tsv"),
  ]);

  useEffect(() => {
    if (template === "" || language === "" || translationStep === "") {
      return;
    }

    var currentState: appState = {
      template: template,
      tranlationStep: translationStep,
      language: language,
    };

    createFileFromJSON(fileAppStateURI, currentState);
  }, [template, language, translationStep]);

  useEffect(() => {
    if (assets === undefined) {
      return;
    }

    const fetchData = async (uri: string, name: string) => {
      try {
        var wordLang = name.substring(0, 2);
        const recordDir = FileSystem.documentDirectory! + wordLang + "/";

        var fileList = await listFiles(recordDir);

        const fileContent = await FileSystem.readAsStringAsync(uri);
        const lines = fileContent.split("\r\n");

        // skip header line
        const dataLines = lines.slice(1);
        const wordMap = new Map();

        dataLines.map((line) => {
          var fields = line.split("\t");

          var JSON = {
            altFormSym: fields[2],
            otherLangEx: fields[3],
            meaning: fields[4],
            relatedTerms: fields[5],
            hasRecording: fileList.includes(fields[1]),
          };

          wordMap.set(fields[1], JSON);
        });

        switch (wordLang) {
          case "en":
            setEN_WordData(wordMap);
            //  setWordData(wordMap);

            break;
          case "fr":
            setFR_WordData(wordMap);
            //setWordData(wordMap);

            break;
          default:
          // code block
        }
      } catch (error) {
        console.error("Error reading CSV file:", error);
      }
    };

    assets!.map((asset) => {
      fetchData(asset!.localUri!, asset!.name!);
    });
  }, [assets]);

  useEffect(() => {
    switch (language) {
      case "en":
        setWordData(en_wordData);
        break;
      case "fr":
        setWordData(fr_wordData);
        break;
      default:
    }
  }, [en_wordData, fr_wordData]);

  useEffect(() => {
    if (Object.keys(templateJSON).length === 0) {
      return;
    }
    setAudioURI(
      FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        templateJSON.passages[pageNumber].audio
    );

    var currentTitle =
      templateJSON.passages[pageNumber].book +
      " " +
      templateJSON.passages[pageNumber].chapter +
      ": " +
      templateJSON.passages[pageNumber].verses;

    fileExists(
      FileSystem.documentDirectory! +
        template +
        "/" +
        stripWordsofSpecialCharacters(currentTitle, ":") +
        "/scriptureImage.jpg"
    ).then((ret) => {
      if (ret) {
        setImageURI(
          FileSystem.documentDirectory! +
            template +
            "/" +
            stripWordsofSpecialCharacters(currentTitle, ":") +
            "/scriptureImage.jpg"
        );
      } else {
        setImageURI(
          FileSystem.documentDirectory +
            template +
            "/audioVisual/" +
            templateJSON.passages[pageNumber].image
        );
      }
    });

    setPassageText(templateJSON.passages[pageNumber].text);
    setNotes(templateJSON.passages[pageNumber].notes);
    setTitle(
      templateJSON.passages[pageNumber].book +
        " " +
        templateJSON.passages[pageNumber].chapter +
        ": " +
        templateJSON.passages[pageNumber].verses
    );
  }, [pageNumber]); // Empty dependency array

  useEffect(() => {
    fileExists(fileAppStateURI).then((exists) => {
      if (exists) {
        readJSONData(fileAppStateURI).then((retJSON) => {
          languageSwitcher(retJSON.language);
          setStep(retJSON.tranlationStep);
          loadTemplate(retJSON.template).then(() => {});
        });
      }
    });
  }, []);

  useEffect(() => {
    //reload current template
    if (!template) {
      return;
    }
    loadTemplate(template);
  }, [language]);

  function setStep(step: string) {
    setTranslationStep(step);
  }

  function changeImage(uri: string) {
    setImageURI(uri);
  }

  function revertImage() {
    setImageURI(
      FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        templateJSON.passages[pageNumber].image
    );
  }

  const setPlayingDraft = (state:boolean) => {
    setIsPlayingDraft(state)
  }

  function languageSwitcher(lng: string) {
    setLanguage(lng);

    switch (lng) {
      case "en":
        setWordData(en_wordData);

        break;
      case "fr":
        setWordData(fr_wordData);

        break;
      default:
    }
  }

  function incrementPageNumber() {
    disableAudio();
    if (pageNumber === templatePassages.length - 1) {
      setPageNumber(0);
    } else {
      setPageNumber(pageNumber + 1);
    }
  }

  function changePageNumber(pgNbr: number) {
    disableAudio();
    if (pgNbr === templatePassages.length - 1) {
      setPageNumber(0);
    } else {
      setPageNumber(pgNbr);
    }
  }

  function decrementPageNumber() {
    disableAudio();
    if (pageNumber === 0) {
      setPageNumber(templatePassages.length - 1);
    } else {
      setPageNumber(pageNumber - 1);
    }
  }

  function getNumberOfPages(): number {
    return templateJSON.passages.length;
  }

  async function getPage(pageNumber: number): Promise<scripture> {
    var audioURI =
      FileSystem.documentDirectory +
      template +
      "/audioVisual/" +
      templateJSON.passages[pageNumber].audio;

    var currentTitle =
      templateJSON.passages[pageNumber].book +
      " " +
      templateJSON.passages[pageNumber].chapter +
      ": " +
      templateJSON.passages[pageNumber].verses;

    var imageURI = "";
    var imgFileExist = await fileExists(
      FileSystem.documentDirectory! +
        template +
        "/" +
        stripWordsofSpecialCharacters(currentTitle, ":") +
        "/scriptureImage.jpg"
    );

    if (imgFileExist) {
      imageURI =
        FileSystem.documentDirectory! +
        template +
        "/" +
        stripWordsofSpecialCharacters(currentTitle, ":") +
        "/scriptureImage.jpg";
    } else {
      imageURI =
        FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        templateJSON.passages[pageNumber].image;
    }

    var passageText = templateJSON.passages[pageNumber].text;
    var notes = templateJSON.passages[pageNumber].notes;
    var title =
      templateJSON.passages[pageNumber].book +
      " " +
      templateJSON.passages[pageNumber].chapter +
      ": " +
      templateJSON.passages[pageNumber].verses;

    return {
      imageURI: imageURI,
      audioURI: audioURI,
      passageText: passageText,
      title: title,
      notes: notes,
    };
  }

  async function loadTemplate(template: string): Promise<any> {
    var jsonData = "";

    setTemplate(template);

    try {
      const fileUri =
        FileSystem.documentDirectory +
        "/" +
        template +
        "/" +
        language +
        "_text.json";
      const jsonData = await FileSystem.readAsStringAsync(fileUri);
      const retJSON = JSON.parse(jsonData);

      setTemplateJSON(retJSON);

      setAudioURI(
        FileSystem.documentDirectory +
          template +
          "/audioVisual/" +
          retJSON.passages[pageNumber].audio
      );

      var currentTitle =
        retJSON.passages[pageNumber].book +
        " " +
        retJSON.passages[pageNumber].chapter +
        ": " +
        retJSON.passages[pageNumber].verses;

      fileExists(
        FileSystem.documentDirectory! +
          template +
          "/" +
          stripWordsofSpecialCharacters(currentTitle, ":") +
          "/scriptureImage.jpg"
      ).then((ret) => {
        if (ret) {
          setImageURI(
            FileSystem.documentDirectory! +
              template +
              "/" +
              stripWordsofSpecialCharacters(currentTitle, ":") +
              "/scriptureImage.jpg"
          );
        } else {
          setImageURI(
            FileSystem.documentDirectory +
              template +
              "/audioVisual/" +
              retJSON.passages[pageNumber].image
          );
        }
      });

      setPassageText(retJSON.passages[pageNumber].text);
      setNotes(retJSON.passages[pageNumber].notes);
      setTitle(
        retJSON.passages[pageNumber].book +
          " " +
          retJSON.passages[pageNumber].chapter +
          ": " +
          retJSON.passages[pageNumber].verses
      );

      setTemplatePassages(retJSON.passages);

      return retJSON;
    } catch (error) {
      console.error("Error reading file:", error);
      return "";
    }
  }

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  const disableAudio = (): void => {
    audioPlayer.removePlayBackListener();
    setAudioStop(true);
    audioPlayer.stopPlayer();
  };

  const enableAudio = () => {
    setAudioStop(false);
  };

  const isPlayRecording = () => {
    setPlayRecording(true);
  };

  const isNotPlayRecording = () => {
    setPlayRecording(false);
  };

  function setHasRecording(key: string, hasRecording: boolean) {
    setWordData((prevMap) => {
      const newMap = new Map(prevMap);
      const existingObject = newMap.get(key);

      if (existingObject) {
        newMap.set(key, { ...existingObject, hasRecording: hasRecording });
      }

      return newMap;
    });

    switch (language) {
      case "en":
        setEN_WordData((prevMap) => {
          const newMap = new Map(prevMap);
          const existingObject = newMap.get(key);

          if (existingObject) {
            newMap.set(key, { ...existingObject, hasRecording: hasRecording });
          }

          return newMap;
        });
      case "fr":
        setFR_WordData((prevMap) => {
          const newMap = new Map(prevMap);
          const existingObject = newMap.get(key);

          if (existingObject) {
            newMap.set(key, { ...existingObject, hasRecording: hasRecording });
          }

          return newMap;
        });
      default:
    }
  }

  return (
    <AppContext.Provider
      value={{
        count,
        audioURI,
        imageURI,
        passageText,
        title,
        notes,
        templatePassages,
        audioStop,
        template,
        en_wordData,
        fr_wordData,
        wordData,
        playRecording,
        translationStep,
        language,
        audioPlayer,
        isPlayingDraft,
        setPlayingDraft,
        setHasRecording,
        changePageNumber,
        changeImage,
        revertImage,
        getPage,
        getNumberOfPages,
        languageSwitcher,
        increment,
        decrement,
        setStep,
        loadTemplate,
        enableAudio,
        disableAudio,
        incrementPageNumber,
        decrementPageNumber,
        isPlayRecording,
        isNotPlayRecording,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, useAppContext, AppProvider };
