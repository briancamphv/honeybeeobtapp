import * as React from "react";

import { StyleProp, StyleSheet, View } from "react-native";

import { Card, Text, Avatar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type Props = {
  size: number;
};

interface HBScriptureCard {
  imageURI: string;
  passageText: string;
  title: string,
}

const HBScriptureCard: React.FC<HBScriptureCard> = ({imageURI, passageText, title}) => {
  type RootStackParamList = {
    Login: undefined; // No parameters for Home screen
    BibleBookList: undefined; // Profile screen expects a userId parameter
  };

  const { t } = useTranslation();

  const LeftContent = (props: Props) => (
    <Avatar.Icon {...props} icon="folder" />
  );

  return (
    <>
      <Card>
 
        <Card.Cover source={{ uri: imageURI }} />
       
        <Card.Content>
          <Text variant="titleLarge">{title}</Text>
          <Text variant="bodyMedium">
           {passageText}
          </Text>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "red",
  },
});

export default HBScriptureCard;
