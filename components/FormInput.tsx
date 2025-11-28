import React from "react";
import { StyleSheet, View, TextInput, TextInputProps } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, style, ...props }: FormInputProps) {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundDefault,
            color: theme.text,
            borderColor: error ? theme.error : theme.border,
          },
          props.multiline ? styles.multiline : null,
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        cursorColor={theme.primary}
        selectionColor={theme.primary + "40"}
        {...props}
      />
      {error ? (
        <ThemedText type="small" style={[styles.error, { color: theme.error }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontWeight: "500",
    marginLeft: Spacing.xs,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  multiline: {
    height: 120,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    textAlignVertical: "top",
  },
  error: {
    marginLeft: Spacing.xs,
  },
});
