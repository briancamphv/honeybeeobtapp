import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useAssets } from "expo-asset";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";
import { IconButton } from "react-native-paper";
import { useNavigation } from "expo-router";

import { Help } from "@/helpers/Enumerators";
import { navigateToScreen } from "@/helpers/NavigateHelper";
import { useLocalSearchParams } from "expo-router";
import { WorkFlowDestinations } from "@/helpers/Enumerators";

const HelpHTMLViewer: React.FC = () => {


  const { language } = useAppContext();
  const { helpFile } = useLocalSearchParams<{ helpFile: string }>();
  const { width } = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);


  const navigation = useNavigation();

 
  const { t } = useTranslation();
  const [assets, error] = useAssets([
    require("../../assets/data/en_TranslateNRevise.html"),
    require("../../assets/data/fr_TranslateNRevise.html"),
  ]);

  useEffect(() => {


    if (assets === undefined) {
      return;
    }

    var name: string = "";


    if (helpFile === "translate") {
      switch (language) {
        case "en":
          name = Help.en_translate;
          break;
        case "fr":
          name = Help.fr_translate;
          break;
        default:
          name = Help.default;
        // code block
      }
    }

    const fetchHtml = async () => {
      try {
        var helpAsset: any = assets!.filter((item) => item.name === name);


        const response = await fetch(helpAsset[0].localUri);
        const html = await response.text();

        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching HTML file:", error);
      }
    };

    fetchHtml();


  }, [language, helpFile, assets])


  return (
    <SafeAreaView style={{ flex: Platform.OS === "ios" ? 0.9 : 1 }}>
      {htmlContent! ? (
        <WebView
          style={{ width: width + 300, margin:0 }}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          onMessage={(item) => {
            console.log("item", item);
          }}
        />
      ) : (
        ""
      )}

      {htmlContent! ? (
        <View style={{ alignItems: "flex-end" }}>
          <IconButton
            icon="close-thick"
            size={32}
            onPress={() => {
              navigateToScreen(navigation, WorkFlowDestinations.translate);
            }}
          />
        </View>
      ) : (
        ""
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HelpHTMLViewer;
