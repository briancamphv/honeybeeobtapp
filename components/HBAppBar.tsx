import * as React from "react";

import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";

import {
  List,
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
import { useAppContext } from "@/context/AppContext";

const HBAppBar: React.FC = () => {
  const navigation = useNavigation();

  const [helpDialogVisible, setHelpDialogVisible] = React.useState(false);

  const onNavigate = (dest: string) => {
    navigation.dispatch(DrawerActions.jumpTo(dest));
  };

  const openHelpDialog = () => setHelpDialogVisible(true);
  const closeHelpDialog = () => setHelpDialogVisible(false);

  const { language } = useAppContext();
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
            title={t("Translate + Revise", { lng: language })}
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
              title={t("Community Work", { lng: language })}
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
              title={t("Accuracy Check", { lng: language })}
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
        <TouchableOpacity style ={{paddingRight:20}} onPress={openHelpDialog}>
          <Icon color="white" source="help" size={25} />
        </TouchableOpacity>
      </View>

      <Portal>
        <Dialog visible={helpDialogVisible} onDismiss={closeHelpDialog}>
          <Dialog.Title>{t("Help", { lng: language })}</Dialog.Title>
          <Dialog.Content>
            <Text>Help</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeHelpDialog}>
              {t("Close", { lng: language })}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "red",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "baseline"
  
  },

  workflow: {
    width: 350,
    padding: 2,
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
