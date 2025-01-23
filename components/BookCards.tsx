import { Card, Title, Appbar } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { listFiles } from "@/helpers/FileUtilies";
import { useAppContext } from "@/context/AppContext";
import * as FileSystem from "expo-file-system";
import { useTheme } from "react-native-paper";

interface BookCards {
  item: string;
  index: number;
  handleBookPress: (value: string) => void;
}

const BookCards: React.FC<BookCards> = ({ item, index, handleBookPress }) => {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const theme = useTheme();

  const [backGroundColor, setBackGroundColor] = useState<string>(
    theme.colors.surface
  );

  const recordDir = FileSystem.documentDirectory!;

  listFiles(recordDir).then((files) => {
    const test = "this";

    files.map((fileDir) => {
      if (fileDir.includes(item)) {
        setBackGroundColor("lightgreen");
      }
    });
  });

  return (
    <Card
      style={[styles.books, { backgroundColor: backGroundColor }]}
      onPress={() => handleBookPress(item)}
    >
      <Card.Content>
        <View style={styles.container}>
          <Title numberOfLines={2} style={styles.bookTitle}>
            {t(item, { lng: language })}
          </Title>
        </View>
      </Card.Content>
    </Card>
  );
};

export default BookCards;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
  },
  books: {
    width: 175, // Adjust the width as needed
    height: 120, // Adjust the height as needed
    margin: 2,
    borderRadius: 10,
  },

  container: {
    alignItems: "center",
    wordWrap: "2",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
