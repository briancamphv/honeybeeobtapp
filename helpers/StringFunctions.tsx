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

  export const replaceExceptFirst = (str:string, charToReplace:string, replacement:string):string => {
    const firstIndex = str.indexOf(charToReplace);
  
    if (firstIndex === -1) {
      return str; // Character not found, return original string
    }
  
    const beforeFirst = str.substring(0, firstIndex + 1);
    const afterFirst = str.substring(firstIndex + 1).replaceAll(charToReplace, replacement);
  
    return beforeFirst + afterFirst;
  }

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