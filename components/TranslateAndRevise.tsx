import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { Portal, Modal } from "react-native-paper";

import { View, StyleSheet } from "react-native";

import { useTranslation } from "react-i18next";

import HBAppBar from "@/components/HBAppBar";
import HBScriptureCard from "@/components/HBScriptureCard";

import HBRecordBar from "@/components/HBRecordBar";

import { scripture } from "../interfaces/appInterfaces";

const TranslateAndRevise: React.FC<scripture> = ({
  imageURI,
  audioURI,
  passageText,
  title,
  notes,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setLoading = (loading: boolean): void => {
    setIsLoading(loading);
  };

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
        <HBAppBar />
        <HBScriptureCard
          imageURI={imageURI}
          passageText={passageText}
          title={title}
          notes={notes}
          audioURI={audioURI}
          setLoading={setLoading}
        />
        <HBRecordBar />
      </View>

      <Portal>
        <Modal style={styles.activityIndicator} visible={isLoading} dismissable={false}>
          <View>
            <ActivityIndicator animating={true} size="large" color="black" />
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default TranslateAndRevise;

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
