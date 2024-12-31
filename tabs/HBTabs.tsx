import { Tabs } from "expo-router";
import React from "react";

import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import i18n from "@/app/translate/i18n";
import { useTranslation } from "react-i18next";
import { AppProvider } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";

const TemplateTab: React.FC = () => {
  const theme = {
    ...DefaultTheme,

    colors: {
      ...DefaultTheme.colors,
      primary: "tomato",
      secondary: "yellow",
    },
  };

  const { t } = useTranslation();

  const colorScheme = useColorScheme();

  const {language} = useAppContext()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("Templates", { lng: language }),

          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="TranslateAndRevise"
        options={{
          title: t("Translate", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="language" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TemplateTab;
