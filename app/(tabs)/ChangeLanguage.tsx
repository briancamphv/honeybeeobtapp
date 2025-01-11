import React from "react";

import { useTranslation } from "react-i18next";

import { Divider, List, MD3Colors } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import {  View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import Languages, { LanguageInterface } from "../data/Languages";

import { useAppContext } from "@/context/AppContext";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

const ChangeLanguage: React.FC = () => {
  const { languageSwitcher, loadTemplate, template } = useAppContext();

  const navigation = useNavigation();

  const { language } = useAppContext();

  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <List.Section title={t("Choose Language", { lng: language })}>
        

        {Languages.map((item: LanguageInterface, index) => (
          <View key={index}>
            <List.Item
              
              onPress={() => {
                languageSwitcher(item.languageCode);

                navigation.dispatch(DrawerActions.jumpTo("Settings"));
              }}
              title={t(item.language, { lng: language })}
              left={() => (
                <List.Icon
                  icon={() => <Ionicons name="language" size={24} />}
                />
              )}
            />
            <Divider />
          </View>
        ))}
      </List.Section>
    </SafeAreaView>
  );
};

export default ChangeLanguage;
