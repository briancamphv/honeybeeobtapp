import React from "react";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

import { List, MD3Colors } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";



const Settings: React.FC = () => {
  const navigation = useNavigation();


  const { language } = useAppContext();

  const {t} = useTranslation();

  return (
    <List.Section>
      <List.Subheader>{t("Settings", { lng: language })}</List.Subheader>
      <List.Item
        onPress={() => {
          navigation.dispatch(DrawerActions.jumpTo("ChangeLanguage"));
        }}
        title={t("Change Language", { lng: language })}
        left={() => (
          <List.Icon icon={() => <Ionicons name="language" size={24} />} />
        )}
      />
      <List.Item
        title={t("Registration", { lng: language })}
        left={() => (
          <List.Icon
            color={MD3Colors.tertiary70}
            icon={() => <Ionicons name="clipboard" size={24} />}
          />
        )}
      />
    </List.Section>
  );
};

export default Settings;
