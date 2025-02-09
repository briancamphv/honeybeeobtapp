import { Tabs } from "expo-router";

import React from "react";

import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";

import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Ionicons } from "@expo/vector-icons";
import { MD3LightTheme as DefaultTheme } from "react-native-paper";

import { useTranslation } from "react-i18next";

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

  const { language, passageText } = useAppContext();

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
        name="Templates"
        options={{
          title: t("Templates", { lng: language }),

          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={28} color={color} />
          ),
        }}
      />
      {passageText !== "" ? (
        <Tabs.Screen
          name="TranslatePager"
          options={{
            title: t("Translate", { lng: language }),
            tabBarIcon: ({ color }) => (
              <Ionicons name="language" size={28} color={color} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="TranslatePager"
          options={{
            href: null,
            title: t("Translate", { lng: language }),
            tabBarIcon: ({ color }) => (
              <Ionicons name="language" size={28} color={color} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="Settings"
        options={{
          title: t("Settings", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ChangeLanguage"
        options={{
          href: null,
          title: t("Change Language", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="WordData"
        options={{
          href: null,
          title: t("Words", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="HelpHTMLViewer"
        options={{
          href: null,
          title: t("Help", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="LearnPager"
        options={{
          href: null,
          title: t("Learn", { lng: language }),
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TemplateTab;
