import React from "react";
import { Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getAppBarProps from "@/helpers/GetAppBarProps";

import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HBAppBar from "@/components/HBAppBar";

import HBOverviewCard from "@/components/HBOverviewCard";

const LearnOverview: React.FC = ({}) => {
  const appbarProps = getAppBarProps("learn");

  const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");
  const insets = useSafeAreaInsets();
  const safeAreaHeight = screenHeight - (insets.top + insets.bottom);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            flex: Platform.OS === "ios" ? 0.93 : 1,
            justifyContent: "center",
            alignItems: "center",
            maxHeight: safeAreaHeight,
          },
        ]}
      >
        <HBAppBar {...appbarProps} />
        <HBOverviewCard />
      </View>
    </SafeAreaView>
  );
};

export default LearnOverview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    margin: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
  },
  item: {
    width: 300,
    height: 100,
    backgroundColor: "#f0f",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightAction: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    animationDuration: "0s",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
