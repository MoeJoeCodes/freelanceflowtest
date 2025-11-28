import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Client } from "@/store/dataStore";

interface ClientCardProps {
  client: Client;
  onPress: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ClientCard({ client, onPress }: ClientCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const initials = client.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: theme.primary + "20" }]}>
        <ThemedText style={[styles.initials, { color: theme.primary }]}>
          {initials}
        </ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText type="h4" numberOfLines={1}>
          {client.name}
        </ThemedText>
        <View style={styles.contactRow}>
          <Feather name="mail" size={12} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary }}
            numberOfLines={1}
          >
            {client.email}
          </ThemedText>
        </View>
        <View style={styles.bottomRow}>
          <Badge type="deal" value={client.dealStage} />
          {client.revenue > 0 ? (
            <ThemedText type="small" style={[styles.revenue, { color: "#21b15a" }]}>
              ${client.revenue.toLocaleString()}
            </ThemedText>
          ) : null}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  revenue: {
    fontWeight: "600",
  },
});
