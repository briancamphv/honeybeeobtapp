import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import getAppBarProps from "@/helpers/GetAppBarProps";

import { View, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";

import HBAppBar from "@/components/HBAppBar";

import { useAppContext } from "@/context/AppContext";

import HBOverviewCard from "@/components/HBOverviewCard";

const HBOverview: React.FC = ({}) => {
  const { t } = useTranslation();

  const appbarProps = getAppBarProps("learn");

  const { translationStep, template, setHasRecording } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          {
            flex: Platform.OS === "ios" ? 0.93 : 1,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <HBAppBar {...appbarProps} />
        <HBOverviewCard />
      </View>
    </SafeAreaView>
  );
};

export default HBOverview;

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
