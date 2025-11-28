import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { StatCard } from "@/components/StatCard";
import { FormInput } from "@/components/FormInput";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, DealStage, ExpenseCategory } from "@/store/dataStore";

const expenseCategories: { key: ExpenseCategory; label: string; color: string }[] = [
  { key: "tools", label: "Tools", color: "#06B6D4" },
  { key: "software", label: "Software", color: "#16adc8" },
  { key: "outsourcing", label: "Outsourcing", color: "#ffa554" },
  { key: "marketing", label: "Marketing", color: "#f97316" },
  { key: "equipment", label: "Equipment", color: "#8b5cf6" },
  { key: "other", label: "Other", color: "#64748b" },
];

type DealStageSummary = {
  stage: DealStage;
  label: string;
  count: number;
  revenue: number;
  color: string;
};

export default function CRMScreen() {
  const { theme } = useTheme();
  const { clients, projects, expenses, addExpense, deleteExpense } = useDataStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<ExpenseCategory>("tools");
  const [newDescription, setNewDescription] = useState("");

  const crmMetrics = useMemo(() => {
    const dealStageLabels: Record<DealStage, string> = {
      lead: "Leads",
      proposal_sent: "Proposals Sent",
      negotiation: "Negotiation",
      won: "Won Deals",
      lost: "Lost Deals",
    };

    const dealStageColors: Record<DealStage, string> = {
      lead: "#06B6D4",
      proposal_sent: "#16adc8",
      negotiation: "#ffa554",
      won: "#21b15a",
      lost: "#ef4444",
    };

    // Calculate metrics by deal stage
    const stageMetrics: DealStageSummary[] = [];
    const stages: DealStage[] = [
      "lead",
      "proposal_sent",
      "negotiation",
      "won",
      "lost",
    ];

    stages.forEach((stage) => {
      const stageClients = clients.filter((c) => c.dealStage === stage);
      const stageRevenue = stageClients.reduce((sum, c) => sum + c.revenue, 0);

      stageMetrics.push({
        stage,
        label: dealStageLabels[stage],
        count: stageClients.length,
        revenue: stageRevenue,
        color: dealStageColors[stage],
      });
    });

    // Calculate pipeline value (won + negotiation deals)
    const pipelineValue = clients
      .filter((c) => c.dealStage === "won" || c.dealStage === "negotiation")
      .reduce((sum, c) => sum + c.revenue, 0);

    // Calculate won deals total
    const wonDealsValue = clients
      .filter((c) => c.dealStage === "won")
      .reduce((sum, c) => sum + c.revenue, 0);

    // Count active deals (everything except lead and lost)
    const activeDeals = clients.filter(
      (c) => c.dealStage !== "lead" && c.dealStage !== "lost"
    ).length;

    // Calculate conversion rate (won / (all - leads))
    const applicableDeals = clients.filter(
      (c) => c.dealStage !== "lead"
    ).length;
    const conversionRate =
      applicableDeals > 0
        ? Math.round((wonDealsValue / applicableDeals) * 100)
        : 0;

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate profit (won deals revenue - expenses)
    const totalProfit = wonDealsValue - totalExpenses;

    // Get recent expenses (last 3)
    const recentExpenses = expenses.slice().reverse().slice(0, 3);

    return {
      stageMetrics,
      pipelineValue,
      wonDealsValue,
      activeDeals,
      conversionRate,
      totalClients: clients.length,
      totalExpenses,
      totalProfit,
      recentExpenses,
    };
  }, [clients, expenses]);

  const handleAddExpense = () => {
    if (newAmount.trim() && newDescription.trim()) {
      addExpense({
        amount: parseFloat(newAmount) || 0,
        category: newCategory,
        description: newDescription.trim(),
        date: new Date().toISOString(),
      });
      setNewAmount("");
      setNewDescription("");
      setNewCategory("tools");
      setModalVisible(false);
    }
  };

  const getCategoryColor = (category: ExpenseCategory) => {
    return expenseCategories.find((c) => c.key === category)?.color || "#64748b";
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    return expenseCategories.find((c) => c.key === category)?.label || category;
  };

  return (
    <View style={styles.container}>
      <ScreenScrollView>
        <View style={styles.header}>
          <ThemedText type="h2">CRM Dashboard</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Revenue Pipeline & Client Deals
          </ThemedText>
        </View>

        {/* Revenue Metrics */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Won Deals"
              value={`$${crmMetrics.wonDealsValue.toLocaleString()}`}
              icon="check-circle"
              color="#21b15a"
            />
            <StatCard
              title="Total Expenses"
              value={`$${crmMetrics.totalExpenses.toLocaleString()}`}
              icon="trending-down"
              color="#ef4444"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Profit"
              value={`$${crmMetrics.totalProfit.toLocaleString()}`}
              icon="award"
              color="#fbbf24"
            />
            <StatCard
              title="Profit Margin"
              value={`${crmMetrics.wonDealsValue > 0 ? Math.round((crmMetrics.totalProfit / crmMetrics.wonDealsValue) * 100) : 0}%`}
              icon="percent"
              color="#16adc8"
            />
          </View>
        </View>

        {/* Deal Pipeline by Stage */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Deal Pipeline by Stage
          </ThemedText>
          {crmMetrics.stageMetrics.map((stage) => (
            <View
              key={stage.stage}
              style={[
                styles.stageCard,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <View style={styles.stageLeft}>
                <View
                  style={[styles.stageBadge, { backgroundColor: stage.color }]}
                >
                  <Feather name="users" size={14} color="#fff" />
                </View>
                <View>
                  <ThemedText type="h4">{stage.label}</ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {stage.count} {stage.count === 1 ? "client" : "clients"}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.stageRight}>
                <ThemedText
                  type="h4"
                  style={{
                    color: stage.color,
                    fontWeight: "600",
                  }}
                >
                  ${stage.revenue.toLocaleString()}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Key Metrics
          </ThemedText>
          <View
            style={[
              styles.metricsGrid,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Total Clients
              </ThemedText>
              <ThemedText type="h2" style={{ color: theme.primary }}>
                {crmMetrics.totalClients}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Avg Deal Value
              </ThemedText>
              <ThemedText type="h2" style={{ color: "#21b15a" }}>
                $
                {crmMetrics.activeDeals > 0
                  ? Math.round(
                      crmMetrics.pipelineValue / crmMetrics.activeDeals
                    ).toLocaleString()
                  : 0}
              </ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.metricItem}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Lead to Close
              </ThemedText>
              <ThemedText
                type="h2"
                style={{ color: "#16adc8", fontWeight: "600" }}
              >
                {crmMetrics.totalClients > 0
                  ? Math.round((crmMetrics.activeDeals / crmMetrics.totalClients) * 100)
                  : 0}
                %
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Expense Logging */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Log Expenses
            </ThemedText>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={({ pressed }) => [
                styles.logButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
          {crmMetrics.recentExpenses.length > 0 ? (
            <View>
              {crmMetrics.recentExpenses.map((expense) => (
                <Pressable
                  key={expense.id}
                  onPress={() => deleteExpense(expense.id)}
                  style={[
                    styles.expenseItem,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View
                    style={[
                      styles.expenseBadge,
                      { backgroundColor: getCategoryColor(expense.category) },
                    ]}
                  >
                    <Feather name="shopping-bag" size={12} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="small" numberOfLines={1}>
                      {expense.description}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={{ color: theme.textSecondary, fontSize: 10 }}
                    >
                      {getCategoryLabel(expense.category)}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="h4"
                    style={{ color: "#ef4444", fontWeight: "600" }}
                  >
                    ${expense.amount.toLocaleString()}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.emptyExpenses,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, textAlign: "center" }}
              >
                No expenses logged yet
              </ThemedText>
            </View>
          )}
        </View>
      </ScreenScrollView>

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setNewAmount("");
          setNewDescription("");
          setNewCategory("tools");
        }}
        title="Log Expense"
      >
        <FormInput
          label="Amount"
          placeholder="0.00"
          value={newAmount}
          onChangeText={setNewAmount}
          keyboardType="decimal-pad"
        />
        <FormInput
          label="Description"
          placeholder="What was this expense for?"
          value={newDescription}
          onChangeText={setNewDescription}
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Category
        </ThemedText>
        <View style={styles.categoryGrid}>
          {expenseCategories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              selected={newCategory === cat.key}
              onPress={() => setNewCategory(cat.key)}
            />
          ))}
        </View>
        <Button onPress={handleAddExpense}>Log Expense</Button>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  statsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: "600",
  },
  stageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  stageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  stageBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  stageRight: {
    alignItems: "flex-end",
  },
  metricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: 50,
    marginHorizontal: Spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  logButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  expenseBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyExpenses: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "500",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
});
