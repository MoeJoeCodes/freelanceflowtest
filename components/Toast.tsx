import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  type?: "success" | "error" | "info";
  duration?: number;
}

export function Toast({ message, visible, onHide, type = "success", duration = 2000 }: ToastProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "x-circle";
      case "info":
        return "info";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success":
        return theme.success;
      case "error":
        return theme.error;
      case "info":
        return theme.info;
    }
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(1);
      
      const timer = setTimeout(() => {
        translateY.value = withSpring(-100, { damping: 15, stiffness: 150 });
        opacity.value = withDelay(100, withSpring(0, {}, () => {
          runOnJS(onHide)();
        }));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + Spacing.lg,
          backgroundColor: theme.backgroundDefault,
          ...Shadows.lg,
        },
        animatedStyle,
      ]}
    >
      <Feather name={getIcon()} size={20} color={getColor()} />
      <ThemedText style={styles.message}>{message}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.xl,
    right: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    zIndex: 1000,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
