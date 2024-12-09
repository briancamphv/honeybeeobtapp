// import 'react-native-gesture-handler';

import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";



const Page = () => {
  const navigation = useNavigation();
  console.log(navigation);
  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const onNavigate = () => {
    navigation.dispatch(DrawerActions.jumpTo("TranslateAndRevise"));
  };
  return (
    
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home</Text>
        <Button onPress={onToggle}>Press Me</Button>
        <Button onPress={onNavigate}>Translate+Revise</Button>
      </View>
 
  );
};

export default Page;
