import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Text,
  TextInput,
  HelperText,
  Divider,
  Snackbar,
  Surface,
  Title,
} from "react-native-paper";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { t } = useTranslation();

  const handleEmailLogin = () => {
    // Implement email login logic here
    // ...
  };

  const handleSocialLogin = (provider: any) => {
    // Implement social login logic here
    // ...
    provider = provider;
  };

  const handlePhoneLogin = () => {
    // Implement phone login logic here
    // ...
  };
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t("Login")} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={[styles.surface, { height: 240 }]}>
          <Title style={styles.title}>{t("Email Login")}</Title>
          <TextInput label={t("Email")} value={email} onChangeText={setEmail} />

          <TextInput
            label={t("Password")}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            style={styles.button}
            mode="contained"
            onPress={handleEmailLogin}
          >
            {t("Sign In")}
          </Button>
          <HelperText type="error" visible={error}>
            {error}
          </HelperText>
        </Surface>
        <Surface style={[styles.surface, { height: 200 }]}>
          <Title style={styles.title}>{t("Social Login")}</Title>

          <Button
            style={styles.button}
            mode="contained"
            onPress={() => handleSocialLogin("google")}
          >
            <FontAwesome5 name="google" size={18} color="white" /> {t("Google")}{" "}
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            onPress={() => handleSocialLogin("facebook")}
          >
            <FontAwesome5 name="facebook-f" size={18} color="white" />{" "}
            {t("Facebook")}
          </Button>

          <Button
            style={styles.button}
            mode="contained"
            onPress={() => handleSocialLogin("twitter")}
          >
            <FontAwesome5 name="twitter" size={18} color="white" />{" "}
            {t("X Formerly Twitter")}
          </Button>
        </Surface>
        <Surface style={[styles.surface, { height: 150 }]}>
          <Title style={styles.title}>{t("Phone Login")}</Title>
          <TextInput
            label={t("Phone Number")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <Button
            style={styles.button}
            mode="contained"
            onPress={handlePhoneLogin}
          >
            {t("Send OTP")}
          </Button>
          {/* ...OTP input and verification logic */}
        </Surface>
      </View>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t("Dismiss") ,
          onPress: () => setShowSnackbar(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { justifyContent: "space-evenly" },
  card: {
    elevation: 10,
  },
  surface: {
    margin: 5,
    padding: 2,
    justifyContent: "space-evenly",
  },
  cardcontent: {
    height: 400,
    justifyContent: "space-evenly",
  },
  buttonContainer: {},

  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  button: {},
});
