import { CommonActions } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";

const navigateWithParams = (
  navigation: any,
  screenName: string,
  params: {}
) => {
  navigation.dispatch(
    CommonActions.navigate({
      name: screenName,
      params: params,
    })
  );
};

export const navigateToScreen = (navigation: any, screen: string) => {
  navigation.dispatch(DrawerActions.jumpTo(screen));
};

export default navigateWithParams;
