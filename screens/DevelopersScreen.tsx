import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, Pressable, Linking, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DeveloperCard } from "@/components/DeveloperCard";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Badge } from "@/components/Badge";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Developer, AvailabilityStatus } from "@/store/dataStore";

const availabilityOptions: { key: AvailabilityStatus; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "busy", label: "Busy" },
  { key: "unavailable", label: "Unavailable" },
];

const roleFilters = ["All", "Full Stack", "UI/UX", "Backend", "Mobile"];

export default function DevelopersScreen() {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { developers, addDeveloper, updateDeveloper, deleteDeveloper } = useDataStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newProfile, setNewProfile] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newAvailability, setNewAvailability] = useState<AvailabilityStatus>("available");

  const filteredDevelopers = useMemo(() => {
    if (selectedFilter === "All") return developers;
    return developers.filter((dev) =>
      dev.role.toLowerCase().includes(selectedFilter.toLowerCase())
    );
  }, [developers, selectedFilter]);

  const handleAddDeveloper = () => {
    if (newName.trim() && newRole.trim()) {
      addDeveloper({
        name: newName.trim(),
        role: newRole.trim(),
        hourlyRate: parseFloat(newRate) || 0,
        profileLink: newProfile.trim(),
        notes: newNotes.trim(),
        availability: newAvailability,
        avatar: Math.floor(Math.random() * 3),
      });
      resetForm();
      setModalVisible(false);
    }
  };

  const handleUpdateAvailability = (status: AvailabilityStatus) => {
    if (selectedDeveloper) {
      updateDeveloper(selectedDeveloper.id, { availability: status });
      setSelectedDeveloper({ ...selectedDeveloper, availability: status });
    }
  };

  const handleDeleteDeveloper = () => {
    if (selectedDeveloper) {
      deleteDeveloper(selectedDeveloper.id);
      setEditModalVisible(false);
      setSelectedDeveloper(null);
    }
  };

  const handleOpenProfile = async () => {
    if (selectedDeveloper?.profileLink) {
      try {
        await Linking.openURL(selectedDeveloper.profileLink);
      } catch (error) {
        console.log("Could not open URL");
      }
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewRole("");
    setNewRate("");
    setNewProfile("");
    setNewNotes("");
    setNewAvailability("available");
  };

  const openEditModal = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setEditModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <ThemedText type="h2">Developers</ThemedText>
        <Pressable
          onPress={() => setModalVisible(true)}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {roleFilters.map((filter) => (
          <Chip
            key={filter}
            label={filter}
            selected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderDeveloper = ({ item, index }: { item: Developer; index: number }) => (
    <View style={[styles.cardWrapper, index % 2 === 0 ? styles.leftCard : styles.rightCard]}>
      <DeveloperCard developer={item} onPress={() => openEditModal(item)} />
    </View>
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="code" size={48} color={theme.textSecondary} />
      <ThemedText type="h4" style={{ color: theme.textSecondary }}>
        No developers yet
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Add team members to your developer library
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredDevelopers}
        renderItem={renderDeveloper}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop, paddingBottom },
        ]}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        title="Add Developer"
      >
        <FormInput
          label="Name"
          placeholder="Enter developer name"
          value={newName}
          onChangeText={setNewName}
        />
        <FormInput
          label="Role"
          placeholder="e.g., Full Stack Developer"
          value={newRole}
          onChangeText={setNewRole}
        />
        <FormInput
          label="Hourly Rate ($)"
          placeholder="Enter hourly rate"
          value={newRate}
          onChangeText={setNewRate}
          keyboardType="numeric"
        />
        <FormInput
          label="Profile Link"
          placeholder="GitHub, LinkedIn, or portfolio URL"
          value={newProfile}
          onChangeText={setNewProfile}
          autoCapitalize="none"
          keyboardType="url"
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Availability
        </ThemedText>
        <View style={styles.availabilityRow}>
          {availabilityOptions.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              selected={newAvailability === opt.key}
              onPress={() => setNewAvailability(opt.key)}
            />
          ))}
        </View>
        <FormInput
          label="Notes"
          placeholder="Add notes about skills, expertise, etc."
          value={newNotes}
          onChangeText={setNewNotes}
          multiline
        />
        <Button onPress={handleAddDeveloper}>Add Developer</Button>
      </Modal>

      <Modal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedDeveloper(null);
        }}
        title={selectedDeveloper?.name || "Developer"}
      >
        {selectedDeveloper ? (
          <>
            <View style={styles.developerDetails}>
              <View style={styles.detailRow}>
                <Feather name="briefcase" size={16} color={theme.textSecondary} />
                <ThemedText type="body">{selectedDeveloper.role}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <Feather name="dollar-sign" size={16} color={theme.success} />
                <ThemedText type="body" style={{ color: theme.success }}>
                  ${selectedDeveloper.hourlyRate}/hr
                </ThemedText>
              </View>
              {selectedDeveloper.notes ? (
                <View style={styles.notesSection}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Notes:
                  </ThemedText>
                  <ThemedText type="body">{selectedDeveloper.notes}</ThemedText>
                </View>
              ) : null}
            </View>

            {selectedDeveloper.profileLink ? (
              <Pressable
                onPress={handleOpenProfile}
                style={({ pressed }) => [
                  styles.profileButton,
                  { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather name="external-link" size={18} color="#FFFFFF" />
                <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  View Profile
                </ThemedText>
              </Pressable>
            ) : null}

            <ThemedText type="h4" style={styles.statusLabel}>
              Update Availability:
            </ThemedText>
            <View style={styles.statusButtons}>
              {availabilityOptions.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => handleUpdateAvailability(opt.key)}
                  style={({ pressed }) => [
                    styles.statusButton,
                    {
                      backgroundColor:
                        selectedDeveloper.availability === opt.key
                          ? theme.primary + "20"
                          : theme.backgroundSecondary,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Badge type="availability" value={opt.key} />
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleDeleteDeveloper}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="trash-2" size={18} color={theme.error} />
              <ThemedText type="body" style={{ color: theme.error }}>
                Remove Developer
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
    marginBottom: Spacing.lg,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  row: {
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardWrapper: {
    flex: 1,
  },
  leftCard: {
    marginRight: Spacing.sm / 2,
  },
  rightCard: {
    marginLeft: Spacing.sm / 2,
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
  availabilityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  developerDetails: {
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
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  statusLabel: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  statusButton: {
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
