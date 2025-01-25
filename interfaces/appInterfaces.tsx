export interface scripture {
    imageURI: string;
    audioURI: string;
    passageText: string;
    title: string;
    notes: any;
  }

  export interface section {
    title: string;
    BEN: string;
    passages: any[];
  }

 export interface WordNote {
    altFormSym: string;
    otherLangEx: string;
    meaning: string;
    relatedTerms: string;
    hasRecording: boolean;
  }

  export interface ExegeticalNote {
    av: string;
    words: string;
    BEN: string;
    comment: string;
    parallelRef: string;
  }

  export interface appState {
    template: string;
    tranlationStep: string;
    language: string;
  }

  export interface workflow {
    title: string,
    color: string,
    icon: string,
    helpfile: string,
  }