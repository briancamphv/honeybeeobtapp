import "react-native-gesture-handler";

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import downloadFile from "@/components/DownloadFile";
import downloadFileWeb from "@/components/DownloadFileWeb";
import { Platform } from "react-native";

const isPhone = Platform.OS === "ios" || Platform.OS === "android";
const isTablet = Platform.OS === "ios" && Platform.OS !== "ios";
const isWeb = Platform.OS === "web";

console.log("index");

const Page = () => {
  const navigation = useNavigation();

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const onNavigate = () => {
    navigation.dispatch(DrawerActions.jumpTo("TranslateAndRevise"));
  };

  console.log("Platform.OS",Platform.OS)
  if (isWeb) {
   
  } else {
  }
  downloadFile(
    "https://drive.google.com/file/d/10KUzpyq2_IFmwlbKazgxo5uvlkFn5QtT/view?usp=drive_link",
    "Jon 1 1-2.mp3"
  );
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button onPress={onToggle}>Press Me</Button>
      <Button onPress={onNavigate}>Translate+Revise</Button>
    </View>
  );
};

export default Page;
