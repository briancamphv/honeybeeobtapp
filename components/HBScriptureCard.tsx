import * as React from "react";

import { StyleProp, StyleSheet, View } from "react-native";

import { Card, Button, Text, Avatar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type Props = {
  size: number;
};

const HBScriptureCard: React.FC = () => {
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
 
        <Card.Cover source={{ uri: "https://fastly.picsum.photos/id/572/700/700.jpg?hmac=2MQKX0qSjDAkngeeebCoPsLnBFXWXZZi627l0BkFqfw" }} />
        <Button>Ok</Button>
        <Card.Content>
          <Text variant="titleLarge">Jonah 1:1-2</Text>
          <Text variant="bodyMedium">
            One day Yahweh said to the prophet Jonah, who was Amittai’s son, 2
            “I have seen how wicked are the people who live in the great city
            called Nineveh. Nineveh. Therefore, go there and warn the people
            that I am planning to destroy their city because of their sins.”
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
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
