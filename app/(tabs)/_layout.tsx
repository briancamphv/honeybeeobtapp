import React from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { I18nextProvider } from "react-i18next";
import i18n from "../translate/i18n";
import { useTranslation } from "react-i18next";
import { AppProvider } from "@/context/AppContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HBTabs from "@/tabs/HBTabs";

const TabLayout = () => {
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

  return (
    <SafeAreaProvider>
      <AppProvider>
        <I18nextProvider i18n={i18n}>
          <PaperProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <HBTabs />
            </GestureHandlerRootView>
          </PaperProvider>
        </I18nextProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default TabLayout;

