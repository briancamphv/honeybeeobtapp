import * as React from "react";

import { StyleSheet } from "react-native";



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
type Props = {
  navigation: any;
};

//const Drawer = createDrawerNavigator();


 const HBAppBar: React.FC<Props> = ({navigation}) => {
  
 
  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const [helpDialogVisible, setHelpDialogVisible] = React.useState(false);

  const openDrawer = () => navigation.openDrawer();

  const closeDrawer = () => setDrawerVisible(false);

  const openHelpDialog = () => setHelpDialogVisible(true);
  const closeHelpDialog = () => setHelpDialogVisible(false);
  const { t } = useTranslation();

  

  return (
    <>
      <Appbar.Header style={styles.title}>
        <Appbar.Action icon="menu" onPress={openDrawer} />
        <Icon source="microphone" size={25} />
        <Appbar.Content title={t("Translate + Revise")} />
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
});

export default HBAppBar;
