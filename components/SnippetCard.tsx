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
import { Snippet } from "@/store/dataStore";

interface SnippetCardProps {
  snippet: Snippet;
  onCopy: () => void;
  onLongPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SnippetCard({ snippet, onCopy, onLongPress }: SnippetCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const copyScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const copyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: copyScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const handleCopyPressIn = () => {
    copyScale.value = withSpring(0.85, springConfig);
  };

  const handleCopyPressOut = () => {
    copyScale.value = withSpring(1, springConfig);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault },
        animatedStyle,
      ]}
    >
      <Pressable
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.content}
      >
        <ThemedText type="h4" numberOfLines={1}>
          {snippet.title}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary }}
          numberOfLines={2}
        >
          {snippet.content}
        </ThemedText>
      </Pressable>
      <AnimatedPressable
        onPress={onCopy}
        onPressIn={handleCopyPressIn}
        onPressOut={handleCopyPressOut}
        style={[styles.copyButton, { backgroundColor: theme.primary + "15" }, copyAnimatedStyle]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="copy" size={18} color={theme.primary} />
      </AnimatedPressable>
    </Animated.View>
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
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
