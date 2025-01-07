import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Button, Switch } from "react-native-paper";
import { useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useAssets } from "expo-asset";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/context/AppContext";

import { Help } from "@/helpers/Enumerators";

interface HTMLViewer {
  helpFile: string;
  closeDialog: () => void;
}



const HTMLViewer: React.FC<HTMLViewer> = ({ helpFile, closeDialog }) => {
  const { width } = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [htmlUri, setHtmlUri] = useState<string | null>(null);

  var name: string = "";
  const { t } = useTranslation();
  const { language } = useAppContext();

  if (helpFile = "translate") {

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

  

  const [assets, error] = useAssets([
    require("../assets/data/en_TranslateNRevise.html"),
    require("../assets/data/fr_TranslateNRevise.html"),
  ]);





  useEffect(() => {
    if (assets === undefined) {
      return;
    }

    setHtmlUri(assets![0].localUri!);

    const fetchHtml = async () => {
      try {
        var helpAsset: any = assets!.filter((item) => (item.name === name));
       
        const response = await fetch(helpAsset[0].localUri);
        const html = await response.text();

        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching HTML file:", error);
      }
    };

    fetchHtml();
  }, [assets]);

  return (
    <>
      {htmlContent! ? (
        <WebView
          style={{ width: width + 300 }}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
        />
      ) : (
        ""
      )}

      <Button onPress={closeDialog}>{t("Close", { lng: language })}</Button>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HTMLViewer;
