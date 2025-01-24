import React from "react";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Touchable } from "react-native";
import PagerView from "react-native-pager-view";
import Learn from "../screens/Learn";
import { useAppContext } from "@/context/AppContext";
import HBOverview from "./HBOverview";

const LearnPager = () => {
  const { getNumberOfSections, templatePassages, disableAudio } =
    useAppContext();

  const pagerViewRef: any = useRef(null);

  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [sections, setSections] = useState<number[]>([]);

  useEffect(() => {
    if (templatePassages === null) {
      return;
    }

    var numPages = getNumberOfSections();

    setNumberOfPages(numPages);

    var sections: number[] = [];

    for (let index = 0; index < numPages; index++) {
      sections.push(index);
    }

    setSections(sections);

    var ndx = 0;
  }, [templatePassages]);

  const handlePageSelected = (event: any) => {
    const currentPageIndex = event.nativeEvent.position;
    disableAudio();

    // Perform any additional actions here
  };

  const handlePageScroll = (event: any) => {
    const { position, offset } = event.nativeEvent;

    // Check if it's the last page and if the scroll is at the end
    // if (position === numberOfPages - 1 && offset === 0) {
    //   pagerViewRef!.current!.setPage(0);
    // } else if (position === 0 && offset < 0) {
    //   pagerViewRef!.current!.setPage(numberOfPages - 1);
    // }
  };

  return (
    <PagerView
      ref={pagerViewRef}
      onPageSelected={handlePageSelected}
      onPageScroll={handlePageScroll}
      style={styles.pagerView}
      initialPage={0}
    >
      <View key={0}>
        <HBOverview />
      </View>

      {sections.map((item, index) => (
        <View key={index + 1}>
          <Learn section={index} />
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

export default LearnPager;
