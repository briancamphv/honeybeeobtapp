import * as React from "react";

import { StyleSheet, View } from "react-native";

import {
  Appbar,
  List,
  IconButton,
  Dialog,
  Portal,
  Button,
  Text,
  Icon,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const HBAppBar: React.FC = () => {
  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

  const navigation = useNavigation();

  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const [helpDialogVisible, setHelpDialogVisible] = React.useState(false);

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const openHelpDialog = () => setHelpDialogVisible(true);
  const closeHelpDialog = () => setHelpDialogVisible(false);
  const { t } = useTranslation();

  return (
    <>
      <Appbar.Header style={styles.title}>
        <Appbar.Action icon="menu" onPress={openDrawer} />

        <Appbar.Content
          title={
            <React.Fragment>
              <View style={styles.titleContainer}>
                <Icon source="microphone" size={25} />
                <Text style={{ marginLeft: 8, fontSize: 20 }}>
                  {t("Translate + Revise")}
                </Text>
              </View>
            </React.Fragment>
          }
        />

        <Appbar.Action icon="help" onPress={openHelpDialog} />
      </Appbar.Header>

      <Portal>
        <Dialog visible={helpDialogVisible} onDismiss={closeHelpDialog}>
          <Dialog.Title>Help</Dialog.Title>
          <Dialog.Content>
            <Text>Help</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeHelpDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "red",
  },

  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HBAppBar;
