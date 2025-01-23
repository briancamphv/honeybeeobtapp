import * as React from "react";
import { useState } from "react";
import { workflow } from "@/interfaces/appInterfaces";

import { StyleSheet, View, TouchableOpacity } from "react-native";

import HTMLViewer from "./HTMLViewer";

import { List, Portal, Icon } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";
import navigateWithParams from "@/helpers/NavigateHelper";
import {
  WorkFlowColors,
  WorkFlowIcons,
  WorkFlowTitles,
  WorkFlowDestinations,
} from "@/helpers/Enumerators";

type htmlHelpRouteParams = {
  helpFile: string;
};

const HBAppBar: React.FC<workflow> = ({ title, color, helpfile, icon }) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const onNavigate = (dest: string) => {
    setExpanded(!expanded);
    navigation.dispatch(DrawerActions.jumpTo(dest));
  };

  const [helpDialogVisible, setHelpDialogVisible] =
    React.useState<boolean>(false);
  var helpAsset = "";

  const handleNavigate = () => {
    navigateWithParams(navigation, "HelpHTMLViewer", { helpFile: "translate" });
  };

  const openHelpDialog = () => handleNavigate();

  const closeHelpDialog = () => setHelpDialogVisible(false);

  const { language } = useAppContext();
  const { t } = useTranslation();

  const WorkFlowMenu = () => {
  

    const _handlePress = () => {
      setExpanded(!expanded);
    };

    return (
      <View style={styles.workflow}>
        <List.Section>
          <List.Accordion
            theme={{ colors: { background: color } }}
            left={(props) => <List.Icon {...props} color="white" icon={icon} />}
            title={t(title, { lng: language })}
            titleStyle={{
              color: "white",
              fontSize: 20,
              fontWeight: "condensedBold",
            }}
            right={(props) => (
              <List.Icon
                {...props}
                color="white"
                icon={expanded ? "chevron-up" : "chevron-down"}
              />
            )}
            onPress={_handlePress}
            expanded={expanded}
          >
            <List.Item
              style={{ backgroundColor: WorkFlowColors.learn }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.learn}
                />
              )}
              title={t(WorkFlowTitles.learn, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.learn)}
            />
             <List.Item
              style={{ backgroundColor: WorkFlowColors.translate }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.translate}
                />
              )}
              title={t(WorkFlowTitles.translate, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.translate)}
            />
            <List.Item
              style={{ backgroundColor: WorkFlowColors.naturalness }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.naturalness}
                />
              )}
              title={t(WorkFlowTitles.naturalness, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.naturalness)}
            />
            <List.Item
              style={{ backgroundColor: WorkFlowColors.accuracy }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.accuracy}
                />
              )}
              title={t(WorkFlowTitles.accuracy, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.accuracy)}
            />
            <List.Item
              style={{ backgroundColor: WorkFlowColors.voice }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.voice}
                />
              )}
              title={t(WorkFlowTitles.voice, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.voice)}
            />
            <List.Item
              style={{ backgroundColor: WorkFlowColors.finalize }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.finalize}
                />
              )}
              title={t(WorkFlowTitles.finalize, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.finalize)}
            />
            <List.Item
              style={{ backgroundColor: WorkFlowColors.review }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon
                  {...props}
                  color="white"
                  icon={WorkFlowIcons.review}
                />
              )}
              title={t(WorkFlowTitles.review, { lng: language })}
              onPress={() => onNavigate(WorkFlowDestinations.review)}
            />
          </List.Accordion>
        </List.Section>
      </View>
    );
  };

  return (
    <>
      <View style={[styles.title, { backgroundColor: color }]}>
        <WorkFlowMenu />
        <TouchableOpacity style={{ paddingRight: 20 }} onPress={openHelpDialog}>
          <Icon color="white" source="help" size={25} />
        </TouchableOpacity>
      </View>

      <Portal>
        {helpDialogVisible ? (
          <HTMLViewer helpFile={helpfile} closeDialog={closeHelpDialog} />
        ) : (
          ""
        )}
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "baseline",
  },

  workflow: {
    width: 350,
    padding: 2,
  },
});

export default HBAppBar;
