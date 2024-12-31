import React, { createContext, useContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { useAssets } from "expo-asset";
import { useTranslation } from "react-i18next";

// Define the type for the context values

interface WordNote {
  altFormSym: string;
  otherLangEx: string;
  meaning: string;
  relatedTerms: string;
}

interface AppContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
  loadTemplate: (template: string) => Promise<any>;
  incrementPageNumber: () => void;
  decrementPageNumber: () => void;
  enableAudio: () => void;
  disableAudio: () => void;
  isPlayRecording: () => void;
  isNotPlayRecording: () => void;
  setStep: (step: string) => void;
  languageSwitcher: (lng:string) => void;
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

  const [audioStop, setAudioStop] = useState<boolean>(false);
  const [playRecording, setPlayRecording] = useState<boolean>(false);

  const [templateJSON, setTemplateJSON] = useState<any>({});
  const [templatePassages, setTemplatePassages] = useState<any>([]);

  const [wordData, setWordData] = useState<Map<string, WordNote>>(new Map());

  const [assets, error] = useAssets(require("../assets/data/wordlinks.csv"));

  useEffect(() => {
    if (assets === undefined) {
      return;
    }

    const fetchData = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(
          assets![0].localUri!
        );
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
          };

          wordMap.set(fields[1], JSON);
        });

        setWordData(wordMap);
      } catch (error) {
        console.error("Error reading CSV file:", error);
      }
    };

    fetchData();
  }, [assets]);

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

    setImageURI(
      FileSystem.documentDirectory +
        template +
        "/audioVisual/" +
        templateJSON.passages[pageNumber].image
    );

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
    // loadTemplate("Jonah 1-2");
    //languageSwitcher("fr");
  }, []);

  function setStep(step: string) {
    setTranslationStep(step);
  }

  function languageSwitcher(lng: string) {
    setLanguage(lng);
  }

  function incrementPageNumber() {
    disableAudio();
    if (pageNumber === templatePassages.length - 1) {
      setPageNumber(0);
    } else {
      setPageNumber(pageNumber + 1);
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

  async function loadTemplate(template: string): Promise<any> {
    var jsonData = "";

    setTemplate(template);

    try {
      const fileUri =
        FileSystem.documentDirectory + "/" + template + "/" + language + "_text.json";
      const jsonData = await FileSystem.readAsStringAsync(fileUri);
      const retJSON = JSON.parse(jsonData);

      setTemplateJSON(retJSON);

      setAudioURI(
        FileSystem.documentDirectory +
          template +
          "/audioVisual/" +
          retJSON.passages[pageNumber].audio
      );

      setImageURI(
        FileSystem.documentDirectory +
          template +
          "/audioVisual/" +
          retJSON.passages[pageNumber].image
      );

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

  const disableAudio = () => {
    setAudioStop(true);
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
        wordData,
        playRecording,
        translationStep,
        language,
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
