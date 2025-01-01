export interface LanguageInterface {
  language: string;
  languageCode: string;
}

const Languages: LanguageInterface[] = [
  { language: "English", languageCode: "en" },
  { language: "French", languageCode: "fr" },
];

export default Languages;
