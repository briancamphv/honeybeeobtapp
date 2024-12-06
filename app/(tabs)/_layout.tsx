import "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-paper";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
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
import i18n from "../translate/i18n";
import { useTranslation } from "react-i18next";

const DrawerLayout = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "tomato",
      secondary: "yellow",
    },
  };

  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider theme={theme}>
        <GestureHandlerRootView>
          <Drawer>
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Home",
                headerTitle: "Home",
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="BibleBookList"
              options={{
                drawerLabel: "Templates",
                headerTitle: "Templates",
                headerRight: () => (
                  <Ionicons
                    size={20}
                    onPress={() => alert("This is a button!")}
                    name="help"
                  />
                ),
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="folder" size={size} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="TranslateAndRevise"
              options={{
                drawerLabel: "Translate+Revise",
                headerTitle: "Translate+Revise",
                headerRight: () => (
                  <Ionicons
                    size={20}
                    onPress={() => alert("This is a button!")}
                    name="help"
                  />
                ),
                drawerIcon: ({ size, color }) => (
                  <Ionicons name="language" size={size} color={color} />
                ),
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </PaperProvider>
    </I18nextProvider>
  );
};

export default DrawerLayout;

// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';

// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Create Login',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.right.square.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Login',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.2.circlepath" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
