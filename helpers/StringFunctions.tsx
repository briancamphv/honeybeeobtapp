const stripWordsofSpecialCharacters = (
    word: string,
    charsToRemove: string
  ): string => {
    let newWord = word;
    for (const char of charsToRemove) {
      newWord = newWord.replaceAll(char, "");
    }

    return newWord;
  };

  export const stripWordsofTokens = (
    word: string,
    tokens: string
  ): string => {

    let newWord = word;
    
    var tokenArray = tokens.split(",")

    tokenArray.map((item) => {
      newWord = newWord.replaceAll(item, "");
      
    })
    

    return newWord;
  };

  export default stripWordsofSpecialCharacters;