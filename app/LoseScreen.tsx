import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function LoseScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Lose_title")}</Text>
      <Button title={t("Try_again_btn")} onPress={() => router.replace("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fcdcdc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkred",
    marginBottom: 20,
  },
});
