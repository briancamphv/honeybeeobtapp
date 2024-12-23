import "react-native-gesture-handler";

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { Platform } from "react-native";
import createFolder from "@/components/CreateWorkSpace";
import GetTemplate from "@/components/DocumentPicker";
import React from "react";
import SoundTest from "@/components/SoundTest";
import { useAppContext } from "@/context/AppContext";

const isPhone = Platform.OS === "ios" || Platform.OS === "android";
const isTablet = Platform.OS === "ios" && Platform.OS !== "ios";
const isWeb = Platform.OS === "web";

console.log("index");

const Index: React.FC = () => {
  const navigation = useNavigation();

  const { count, increment, decrement, loadTemplate } = useAppContext();

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const onNavigate = () => {
    navigation.dispatch(DrawerActions.jumpTo("TranslateAndRevise"));
  };

  console.log("Platform.OS", Platform.OS);
  if (isWeb) {
  } else {
  }
 

  function buildFolder() {
    createFolder("honeybee_work2");
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button onPress={onToggle}>Press Me</Button>
      <Button onPress={onNavigate}>Translate+Revise</Button>
      <Button onPress={buildFolder}>Create Work Folder</Button>

      <GetTemplate />

      <View>
        <Text>Count: {count}</Text>
        <Button onPress={increment}>Increment</Button>
        <Button onPress={decrement}>Decrement</Button>
        <Button onPress={decrement}>Decrement</Button>
        <Button
          onPress={() => {
            loadTemplate("Jonah 1-2 2");
          }}
        >
          Load Template
        </Button>
      </View>
    </View>
  );
};

export default Index;
