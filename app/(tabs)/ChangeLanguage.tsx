import React from "react";

import { List, MD3Colors } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import Languages, { LanguageInterface } from "../data/Languages";

import { useAppContext } from "@/context/AppContext";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const ChangeLanguage: React.FC = () => {
  const { languageSwitcher, loadTemplate, template } = useAppContext();

  const navigation = useNavigation();

  return (
    <List.Section>
      <List.Subheader>Settings</List.Subheader>

      {Languages.map((item: LanguageInterface, index) => (
        <List.Item
          key={index}
          onPress={() => {
            languageSwitcher(item.languageCode);

            navigation.dispatch(DrawerActions.jumpTo("Settings"));
          }}
          title={item.language}
          left={() => (
            <List.Icon icon={() => <Ionicons name="language" size={24} />} />
          )}
        />
      ))}
    </List.Section>
  );
};

export default ChangeLanguage;
