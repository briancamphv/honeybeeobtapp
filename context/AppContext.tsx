import React, { createContext, useContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useAssets } from "expo-asset";
import {
  fileExists,
  readJSONData,
  createFileFromJSON,
} from "@/helpers/FileUtilies";
import stripWordsofSpecialCharacters from "@/helpers/StringFunctions";
import AudioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";

import { listFiles } from "@/helpers/FileUtilies";
import { WordNote } from "@/interfaces/appInterfaces";

import { appState, section, scripture } from "@/interfaces/appInterfaces";
import { ExegeticalNote } from "@/interfaces/appInterfaces";


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
  getNumberOfSections: () => number;
  setHasRecording: (key: string, hasRecording: boolean) => void;
  setPlayingDraft: (state: boolean) => void;
  getSection(sectionNumber: number): section;
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
  bookOverview: string;
  bookNotes: ExegeticalNote[];
  templateTitle: string;
  passageOverview: string;
  passageOverviewAV: [];
  historicalContext: string;
  historicalContextAV: [];
  backgroundInfo: string;
  backgroundInfoAV: [];
  prominentThemes: string;
  prominentThemesAV: [];
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

  const [bookOverview, setBookOverview] = useState<string>("");
  const [bookNotes, setBookNotes] = useState<any[]>([]);
  const [templateTitle, setTemplateTitle] = useState<string>("");
  const [passageOverview, setPassageOverview] = useState<string>("");
  const [passageOverviewAV, setPassageOverviewAV] = useState<[]>([]);
  const [historicalContext, setHistoricalContext] = useState<string>("");
  const [historicalContextAV, setHistoricalContextAV] = useState<[]>([]);
  const [backgroundInfo, setBackgroundInfo] = useState<string>("");
  const [backgroundInfoAV, setBackgroundInfoAV] = useState<[]>([]);
  const [prominentThemes, setProminentThemes] = useState<string>("");
  const [prominentThemesAV, setProminentThemesAV] = useState<[]>([]);

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
  const [templateJSONPassages, setTemplateJSONPassages] = useState<any>({});
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
        templateJSONPassages[pageNumber].audio
    );

    var currentTitle =
      templateJSONPassages[pageNumber].book +
      " " +
      templateJSONPassages[pageNumber].chapter +
      ": " +
      templateJSONPassages[pageNumber].verses;

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
            templateJSONPassages[pageNumber].image
        );
      }
    });

    setPassageText(templateJSONPassages[pageNumber].text);
    setNotes(templateJSONPassages[pageNumber].notes);
    setTitle(
      templateJSONPassages[pageNumber].book +
        " " +
        templateJSONPassages[pageNumber].chapter +
        ": " +
        templateJSONPassages[pageNumber].verses
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
        templateJSONPassages[pageNumber].image
    );
  }

  const setPlayingDraft = (state: boolean) => {
    setIsPlayingDraft(state);
  };

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
    return templateJSONPassages.length;
  }

  function getNumberOfSections(): number {
    return templateJSON.sections.length;
  }

  function getSection(sectionNumber: number): section {
   
    return {
      title: templateJSON.sections[sectionNumber].section.title,
      BEN: templateJSON.sections[sectionNumber].section.BEN,
      passages: templateJSON.sections[sectionNumber].section.passages,
    };
  }

  async function getPage(pageNumber: number): Promise<scripture> {
    var audioURI =
      FileSystem.documentDirectory +
      template +
      "/audioVisual/" +
      templateJSONPassages[pageNumber].audio;

    var currentTitle =
      templateJSONPassages[pageNumber].book +
      " " +
      templateJSONPassages[pageNumber].chapter +
      ": " +
      templateJSONPassages[pageNumber].verses;

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
        templateJSONPassages[pageNumber].image;
    }

    var passageText = templateJSONPassages[pageNumber].text;
    var notes = templateJSONPassages[pageNumber].notes;
    var title =
      templateJSONPassages[pageNumber].book +
      " " +
      templateJSONPassages[pageNumber].chapter +
      ": " +
      templateJSONPassages[pageNumber].verses;

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

    var passageArray: any[] = [];

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
      setTemplateJSON(retJSON)

      //build passage array

      retJSON.sections.map((item: any, index:number) => {
       
        passageArray = [...passageArray,...item.section.passages]
        
      });

      setTemplateJSONPassages(passageArray);
   

      setAudioURI(
        FileSystem.documentDirectory +
          template +
          "/audioVisual/" +
          passageArray[pageNumber].audio
      );

      var currentTitle =
        passageArray[pageNumber].book +
        " " +
        passageArray[pageNumber].chapter +
        ": " +
        passageArray[pageNumber].verses;

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
              passageArray[pageNumber].image
          );
        }
      });

      setPassageText(passageArray[pageNumber].text);
      setNotes(passageArray[pageNumber].notes);
      setTitle(
        passageArray[pageNumber].book +
          " " +
          passageArray[pageNumber].chapter +
          ": " +
          passageArray[pageNumber].verses
      );

      setTemplatePassages(passageArray);

      setBookOverview(retJSON.learn.book.overview);
      setBookNotes(retJSON.learn.book.notes);
      setTemplateTitle(retJSON.learn.title);
      setPassageOverview(retJSON.learn.passageOverview.text);
      setPassageOverviewAV(retJSON.learn.passageOverview.av);
      setHistoricalContext(retJSON.learn.historicalContext.text);
      setHistoricalContextAV(retJSON.learn.historicalContext.av);
      setBackgroundInfo(retJSON.learn.backgroundInfo.text);
      setBackgroundInfoAV(retJSON.learn.backgroundInfo.av);
      setProminentThemes(retJSON.learn.prominentThemes.text);
      setProminentThemesAV(retJSON.learn.prominentThemes.av);

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
        bookOverview,
        bookNotes,
        templateTitle,
        passageOverview,
        passageOverviewAV,
        historicalContext,
        historicalContextAV,
        backgroundInfo,
        backgroundInfoAV,
        prominentThemes,
        prominentThemesAV,
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
        getNumberOfSections,
        getSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, useAppContext, AppProvider };
