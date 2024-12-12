import * as React from "react";

import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";

import {
  Appbar,
  List,
  IconButton,
  Dialog,
  Portal,
  Button,
  Text,
  Icon,
  FAB,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const HBAppBar: React.FC = () => {
  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

  const isWeb = false;

  const navigation = useNavigation();

  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const [helpDialogVisible, setHelpDialogVisible] = React.useState(false);

  const [stageMenuOpen, setStageMenuOpen] = React.useState<boolean>(true);
  const [toggleStackOnLongPress, setToggleStackOnLongPress] =
    React.useState<boolean>(false);

  const openDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer());

  const onNavigate = (dest:string) => {
    navigation.dispatch(DrawerActions.jumpTo(dest));
  };

  const openHelpDialog = () => setHelpDialogVisible(true);
  const closeHelpDialog = () => setHelpDialogVisible(false);
  const { t } = useTranslation();

  const WorkFlowMenu = () => {
    const [expanded, setExpanded] = React.useState<boolean>(false);

    const _handlePress = () => {
      setExpanded(!expanded);
    };

    return (
      <View style={styles.workflow}>
        <List.Section>
          <List.Accordion
            theme={{ colors: { background: "red" } }}
            left={(props) => (
              <List.Icon {...props} color="white" icon="microphone" />
            )}
            title={t("Translate + Revise")}
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
          >
            <List.Item
              style={{ backgroundColor: "green" }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon {...props} color="white" icon="account-multiple" />
              )}
              title="Community Work"
              onPress={() => onNavigate("index")}
            />
            <List.Item
              style={{ backgroundColor: "blue" }}
              titleStyle={{
                color: "white",
                fontSize: 20,
                fontWeight: "condensedBold",
              }}
              left={(props) => (
                <List.Icon {...props} color="white" icon="bullseye-arrow" />
              )}
              title="Accuracy Check"
              onPress={() => onNavigate("BibleBookList")}
            />
          </List.Accordion>
        </List.Section>
      </View>
    );
  };

  return (
    <>
      <View style={styles.title}>
        <WorkFlowMenu />
        <TouchableOpacity  onPress={openHelpDialog}>
          <Icon color="white" source="help" size={25} />
        </TouchableOpacity>
      </View>

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
      <Portal>
        <FAB.Group
          open={stageMenuOpen}
          icon={stageMenuOpen ? "calendar-today" : "plus"}
          toggleStackOnLongPress={toggleStackOnLongPress}
          actions={[
            { icon: "plus", onPress: () => {} },
            { icon: "star", label: "Star", onPress: () => {} },
            { icon: "email", label: "Email", onPress: () => {} },
            {
              icon: "bell",
              label: "Remind",
              onPress: () => {},
              size: "medium",
            },
            {
              icon: toggleStackOnLongPress ? "gesture-tap" : "gesture-tap-hold",
              label: toggleStackOnLongPress
                ? "Toggle on Press"
                : "Toggle on Long Press",
              onPress: () => {
                setToggleStackOnLongPress(!toggleStackOnLongPress);
              },
            },
          ]}
          enableLongPressWhenStackOpened
          onStateChange={({ open }: { open: boolean }) =>
            setStageMenuOpen(open)
          }
          onPress={() => {
            if (toggleStackOnLongPress) {
              isWeb ? alert("Fab is Pressed") : Alert.alert("Fab is Pressed");
              // do something on press when the speed dial is closed
            } else if (stageMenuOpen) {
              isWeb ? alert("Fab is Pressed") : Alert.alert("Fab is Pressed");
              // do something if the speed dial is open
            }
          }}
          onLongPress={() => {
            if (!toggleStackOnLongPress || stageMenuOpen) {
              isWeb
                ? alert("Fab is Long Pressed")
                : Alert.alert("Fab is Long Pressed");
              // do something if the speed dial is open
            }
          }}
          visible={true}
        />
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "red",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "baseline",
    
  },

  workflow: {
    width: 350,
    padding: 20,
  },
});

export default HBAppBar;

{
  /* <Appbar.Header elevated={true} style={styles.title}>
<Appbar.Action color="white" icon="menu" onPress={openDrawer} />

<Appbar.Content
  title={
    <React.Fragment>
      <View>
        {/* <Icon color="white" source="microphone" size={25} />
        <Text
          style={{
            marginLeft: 8,
            fontSize: 20,
            fontWeight: "600",
            color: "white",
          }}
        >
          {t("Translate + Revise")}
        </Text> 
        <WorkFlowMenu />
      </View>
    </React.Fragment>
  }
></Appbar.Content>

<Appbar.Action color="white" icon="help" onPress={openHelpDialog} />
</Appbar.Header> */
}
