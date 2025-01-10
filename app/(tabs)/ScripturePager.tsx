import React from "react";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import PagerView from "react-native-pager-view";
import TranslateAndRevise from "../../components/TranslateAndRevise";
import { useAppContext } from "@/context/AppContext";
import { scripture } from "../../interfaces/appInterfaces";

const ScripturePager = () => {
  const {
    getPage,
    getNumberOfPages,
    passageText,
    incrementPageNumber,
    decrementPageNumber,
  } = useAppContext();

  const scriptureArray: scripture[] = [];
  const pagerViewRef: any = useRef(null);

  const [scripturePages, setScripturePages] = useState<scripture[]>([]);
  const [prevPageNumber, setPrevPageNumber] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    if (passageText === null) {
      return;
    }

    var numPages = getNumberOfPages();
    setNumberOfPages(numPages);

    var ndx = 0;

    while (ndx < numPages) {
      if (ndx === numPages - 1) {
        getPage(ndx).then((scripture) => {
          scriptureArray.push(scripture);
          setScripturePages(scriptureArray);
        });
      } else {
        getPage(ndx).then((scripture) => scriptureArray.push(scripture));
      }

      ndx++;
    }
  }, [passageText]);

  const handlePageSelected = (event: any) => {
    const currentPageIndex = event.nativeEvent.position;

    if (prevPageNumber > currentPageIndex) {
      decrementPageNumber();
    } else {
      incrementPageNumber();
    }

    setPrevPageNumber(currentPageIndex);

    // Perform any additional actions here
  };

  const handlePageScroll = (event: any) => {
    const { position, offset } = event.nativeEvent;

    console.log("event", position, offset, numberOfPages);

    // Check if it's the last page and if the scroll is at the end
    if (position === numberOfPages - 1 && offset === 0) {
      pagerViewRef!.current!.setPage(0);
    } else if (position === 0 && offset < 0) {
      pagerViewRef!.current!.setPage(numberOfPages - 1);
    }
  };

  return (
    <PagerView
      ref={pagerViewRef}
      onPageSelected={handlePageSelected}
      style={styles.pagerView}
      initialPage={0}
    >
      {scripturePages.map((scripture, index) => (
        <View key={index}>
          <TranslateAndRevise
            imageURI={scripture.imageURI}
            audioURI={scripture.audioURI}
            passageText={scripture.passageText}
            title={scripture.title}
            notes={scripture.notes}
          />
        </View>
      ))}
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default ScripturePager;
