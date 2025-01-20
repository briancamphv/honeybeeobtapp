export interface scripture {
    imageURI: string;
    audioURI: string;
    passageText: string;
    title: string;
    notes: any;
  }

 export interface WordNote {
    altFormSym: string;
    otherLangEx: string;
    meaning: string;
    relatedTerms: string;
    hasRecording: boolean;
  }

  export interface appState {
    template: string;
    tranlationStep: string;
    language: string;
  }