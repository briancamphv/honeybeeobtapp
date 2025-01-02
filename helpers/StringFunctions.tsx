const stripWordsofSpecialCharacters = (
    word: string,
    charsToRemove: string
  ): string => {
    let newWord = word;
    for (const char of charsToRemove) {
      newWord = newWord.replace(char, "");
    }

    return newWord;
  };

  export default stripWordsofSpecialCharacters;