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
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Project } from "@/store/dataStore";

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  onLongPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProjectCard({ project, onPress, onLongPress }: ProjectCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const deadline = new Date(project.deadline);
  const isOverdue = deadline < new Date() && project.column !== "completed";
  const formattedDate = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundRoot },
        animatedStyle,
      ]}
    >
      <ThemedText type="h4" numberOfLines={2}>
        {project.title}
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary }}
        numberOfLines={1}
      >
        {project.clientName}
      </ThemedText>
      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Feather
            name="calendar"
            size={12}
            color={isOverdue ? theme.error : theme.textSecondary}
          />
          <ThemedText
            type="small"
            style={{ color: isOverdue ? theme.error : theme.textSecondary }}
          >
            {formattedDate}
          </ThemedText>
        </View>
        <ThemedText type="small" style={[styles.revenue, { color: "#21b15a" }]}>
          ${project.revenue.toLocaleString()}
        </ThemedText>
      </View>
      {project.notes ? (
        <ThemedText
          type="small"
          style={[styles.notes, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {project.notes}
        </ThemedText>
      ) : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  revenue: {
    fontWeight: "600",
  },
  notes: {
    marginTop: Spacing.xs,
    fontStyle: "italic",
  },
});
