import * as FileSystem from "expo-file-system";

export default async function loadTemplate(template: string): Promise<any> {
  var jsonData = "";

  try {
    const fileUri =
      FileSystem.documentDirectory + "/" + template + "/text.json";
    const jsonData = await FileSystem.readAsStringAsync(fileUri);
    const retJSON = JSON.parse(jsonData);
    return retJSON;
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
}
