import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { DealStage, AvailabilityStatus, KanbanColumn } from "@/store/dataStore";

interface BadgeProps {
  type: "deal" | "availability" | "kanban";
  value: DealStage | AvailabilityStatus | KanbanColumn;
}

const dealLabels: Record<DealStage, string> = {
  lead: "Lead",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

const availabilityLabels: Record<AvailabilityStatus, string> = {
  available: "Available",
  busy: "Busy",
  unavailable: "Unavailable",
};

const kanbanLabels: Record<KanbanColumn, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  waiting: "Waiting",
  revisions: "Revisions",
  ready: "Ready",
  completed: "Completed",
};

export function Badge({ type, value }: BadgeProps) {
  const { theme } = useTheme();

  const getColors = () => {
    if (type === "deal") {
      const stage = value as DealStage;
      switch (stage) {
        case "lead":
          return { bg: theme.info + "20", text: theme.info };
        case "proposal_sent":
          return { bg: theme.secondary + "20", text: theme.secondary };
        case "negotiation":
          return { bg: theme.warning + "20", text: theme.warning };
        case "won":
          return { bg: theme.success + "20", text: theme.success };
        case "lost":
          return { bg: theme.textSecondary + "20", text: theme.textSecondary };
      }
    } else if (type === "availability") {
      const status = value as AvailabilityStatus;
      switch (status) {
        case "available":
          return { bg: theme.success + "20", text: theme.success };
        case "busy":
          return { bg: theme.warning + "20", text: theme.warning };
        case "unavailable":
          return { bg: theme.error + "20", text: theme.error };
      }
    } else {
      const column = value as KanbanColumn;
      switch (column) {
        case "todo":
          return { bg: theme.textSecondary + "20", text: theme.textSecondary };
        case "in_progress":
          return { bg: theme.info + "20", text: theme.info };
        case "waiting":
          return { bg: theme.warning + "20", text: theme.warning };
        case "revisions":
          return { bg: theme.secondary + "20", text: theme.secondary };
        case "ready":
          return { bg: theme.success + "20", text: theme.success };
        case "completed":
          return { bg: theme.success + "20", text: theme.success };
      }
    }
  };

  const getLabel = () => {
    if (type === "deal") return dealLabels[value as DealStage];
    if (type === "availability") return availabilityLabels[value as AvailabilityStatus];
    return kanbanLabels[value as KanbanColumn];
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <ThemedText style={[styles.text, { color: colors.text }]}>
        {getLabel()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
