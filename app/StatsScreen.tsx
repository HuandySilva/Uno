import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import * as ScreenOrientation from "expo-screen-orientation";
import { getStats, GameStats } from "../utils/StatsUtils";

export default function StatsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    async function handleOrientation() {
      const { width, height } = Dimensions.get("window");
      const isTablet =
        Platform.OS === "ios" ? Platform.isPad : Math.min(width, height) >= 600;
      if (isTablet) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      }
    }
    handleOrientation();

    async function loadStats() {
      const data = await getStats();
      setStats(data);
    }
    loadStats();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const formatTime = (seconds: number | null) => {
    if (!seconds || seconds === 0) return t("No_record");
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} ${t("Seconds_label")}`;
    return `${m} ${t("Minutes_label")} ${t("and")} ${s} ${t("Seconds_label")}`;
  };

  const StatRow = ({
    label,
    value,
    isTime = false,
    color = "#007AFF",
  }: any) => {
    const displayValue = isTime ? formatTime(value) : (value ?? 0);
    return (
      <View
        style={styles.statRow}
        accessible={true}
        accessibilityLabel={`${label}: ${displayValue}`}
      >
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{displayValue}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title} accessibilityRole="header">
            {t("Stats_title")}
          </Text>

          {stats ? (
            <View style={styles.statsCard}>
              <Text style={styles.sectionTitle}>{t("General_Summary")}</Text>
              <StatRow label={t("Games_played")} value={stats.gamesPlayed} />
              <StatRow label={t("Wins")} value={stats.wins} color="#28a745" />
              <StatRow
                label={t("Losses")}
                value={stats.losses}
                color="#dc3545"
              />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t("Points_and_Glory")}</Text>
              <StatRow
                label={t("Total_points_won")}
                value={stats.totalPoints}
                color="#28a745"
              />
              <StatRow
                label={t("Max_points_win")}
                value={stats.maxPointsInWin}
                color="#28a745"
              />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t("Defeat_Impact")}</Text>
              <StatRow
                label={t("Total_points_lost")}
                value={stats.totalPointsLost}
                color="#dc3545"
              />
              <StatRow
                label={t("Max_points_loss")}
                value={stats.maxPointsInLoss}
                color="#dc3545"
              />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t("Records_and_Time")}</Text>
              <StatRow
                label={t("Total_cards_drawn")}
                value={stats.totalCardsDrawn}
              />
              <StatRow
                label={t("Longest_match")}
                value={stats.longestMatch}
                isTime={true}
              />
              <StatRow
                label={t("Shortest_win")}
                value={stats.shortestWin}
                isTime={true}
              />
              <StatRow
                label={t("Total_time")}
                value={stats.totalPlayTime}
                isTime={true}
              />
            </View>
          ) : (
            <Text style={styles.subtitle}>{t("Loading")}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t("Back_btn")}
          >
            <Text style={styles.buttonText}>{t("Back_btn")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Text style={styles.footer}>v1.1.0 - Score System Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  statsCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
    flex: 1.5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  footer: {
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 12,
    color: "#999",
  },
});
