import React from "react";

import { StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

import { List, MD3Colors, Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings: React.FC = () => {
  const navigation = useNavigation();

  const { language } = useAppContext();

  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <List.Section
        titleStyle={styles.section}
        title={t("Settings", { lng: language })}
      >
        <View style={styles.container}>
          <List.Item
            titleStyle={styles.item}
            onPress={() => {
              navigation.dispatch(DrawerActions.jumpTo("ChangeLanguage"));
            }}
            title={t("Change Language", { lng: language })}
            left={() => (
              <List.Icon icon={() => <Ionicons name="language" size={24} />} />
            )}
          />
          <Divider />
          <List.Item
            titleStyle={styles.item}
            onPress={() => {
              navigation.dispatch(DrawerActions.jumpTo("WordData"));
            }}
            title={t("Words", { lng: language })}
            left={() => (
              <List.Icon icon={() => <Ionicons name="book" size={24} />} />
            )}
          />
          <Divider />

          <List.Item
            title={t("Registration", { lng: language })}
            titleStyle={styles.item}
            left={() => (
              <List.Icon
                color={MD3Colors.tertiary70}
                icon={() => <Ionicons name="clipboard" size={24} />}
              />
            )}
          />
        </View>
      </List.Section>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
  },
  section: {
    fontSize: 20,
  },
  item: {
    fontSize: 15,
  },
});

export default Settings;
