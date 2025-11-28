import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ClientCard } from "@/components/ClientCard";
import { FormInput } from "@/components/FormInput";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Client, DealStage } from "@/store/dataStore";

const dealStages: { key: DealStage; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "proposal_sent", label: "Proposal Sent" },
  { key: "negotiation", label: "Negotiation" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

export default function ClientsScreen() {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { clients, addClient, updateClient, deleteClient } = useDataStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDealStage, setNewDealStage] = useState<DealStage>("lead");
  const [newNotes, setNewNotes] = useState("");

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const handleAddClient = () => {
    if (newName.trim()) {
      addClient({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        dealStage: newDealStage,
        revenue: 0,
        notes: newNotes.trim(),
      });
      resetForm();
      setModalVisible(false);
    }
  };

  const handleUpdateStage = (stage: DealStage) => {
    if (selectedClient) {
      updateClient(selectedClient.id, { dealStage: stage });
      setSelectedClient({ ...selectedClient, dealStage: stage });
    }
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setEditModalVisible(false);
      setSelectedClient(null);
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewDealStage("lead");
    setNewNotes("");
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setEditModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <ThemedText type="h2">Clients</ThemedText>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="search" size={20} color={theme.text} />
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
      {showSearch ? (
        <FormInput
          placeholder="Search clients..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      ) : null}
    </View>
  );

  const renderClient = ({ item }: { item: Client }) => (
    <ClientCard client={item} onPress={() => openEditModal(item)} />
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="users" size={48} color={theme.textSecondary} />
      <ThemedText type="h4" style={{ color: theme.textSecondary }}>
        No clients yet
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Add your first client to start tracking deals
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredClients}
        renderItem={renderClient}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        title="New Client"
      >
        <FormInput
          label="Name"
          placeholder="Enter client name"
          value={newName}
          onChangeText={setNewName}
        />
        <FormInput
          label="Email"
          placeholder="Enter email address"
          value={newEmail}
          onChangeText={setNewEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput
          label="Phone"
          placeholder="Enter phone number"
          value={newPhone}
          onChangeText={setNewPhone}
          keyboardType="phone-pad"
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Deal Stage
        </ThemedText>
        <View style={styles.stageRow}>
          {dealStages.slice(0, 3).map((stage) => (
            <Chip
              key={stage.key}
              label={stage.label}
              selected={newDealStage === stage.key}
              onPress={() => setNewDealStage(stage.key)}
            />
          ))}
        </View>
        <FormInput
          label="Notes"
          placeholder="Add notes about this client"
          value={newNotes}
          onChangeText={setNewNotes}
          multiline
        />
        <Button onPress={handleAddClient}>Add Client</Button>
      </Modal>

      <Modal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedClient(null);
        }}
        title={selectedClient?.name || "Client"}
      >
        {selectedClient ? (
          <>
            <View style={styles.clientDetails}>
              <View style={styles.detailRow}>
                <Feather name="mail" size={16} color={theme.textSecondary} />
                <ThemedText type="body">{selectedClient.email || "No email"}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <Feather name="phone" size={16} color={theme.textSecondary} />
                <ThemedText type="body">{selectedClient.phone || "No phone"}</ThemedText>
              </View>
              {selectedClient.revenue > 0 ? (
                <View style={styles.detailRow}>
                  <Feather name="dollar-sign" size={16} color={theme.success} />
                  <ThemedText type="body" style={{ color: theme.success }}>
                    ${selectedClient.revenue.toLocaleString()} total revenue
                  </ThemedText>
                </View>
              ) : null}
              {selectedClient.notes ? (
                <View style={styles.notesSection}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Notes:
                  </ThemedText>
                  <ThemedText type="body">{selectedClient.notes}</ThemedText>
                </View>
              ) : null}
            </View>

            <ThemedText type="h4" style={styles.stageLabel}>
              Update Deal Stage:
            </ThemedText>
            <View style={styles.stageButtons}>
              {dealStages.map((stage) => (
                <Pressable
                  key={stage.key}
                  onPress={() => handleUpdateStage(stage.key)}
                  style={({ pressed }) => [
                    styles.stageButton,
                    {
                      backgroundColor:
                        selectedClient.dealStage === stage.key
                          ? theme.primary + "20"
                          : theme.backgroundSecondary,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Badge type="deal" value={stage.key} />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleDeleteClient}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="trash-2" size={18} color={theme.error} />
              <ThemedText type="body" style={{ color: theme.error }}>
                Delete Client
              </ThemedText>
            </Pressable>
          </>
        ) : null}
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  headerContent: {
    marginBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    marginTop: Spacing.md,
  },
  separator: {
    height: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  stageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  clientDetails: {
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: BorderRadius.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  notesSection: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  stageLabel: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  stageButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  stageButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    padding: Spacing.lg,
  },
});
