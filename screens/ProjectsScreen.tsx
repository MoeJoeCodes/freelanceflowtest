import React, { useState, useMemo } from "react";
import { View, StyleSheet, ScrollView, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProjectCard } from "@/components/ProjectCard";
import { FAB } from "@/components/FAB";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Project, KanbanColumn } from "@/store/dataStore";

const columns: { key: KanbanColumn; label: string; color: string }[] = [
  { key: "todo", label: "To Do", color: "#6B7280" },
  { key: "in_progress", label: "In Progress", color: "#3B82F6" },
  { key: "waiting", label: "Waiting", color: "#F59E0B" },
  { key: "revisions", label: "Revisions", color: "#8B5CF6" },
  { key: "ready", label: "Ready", color: "#10B981" },
  { key: "completed", label: "Completed", color: "#059669" },
];

export default function ProjectsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { projects, clients, addProject, moveProject, deleteProject } = useDataStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newRevenue, setNewRevenue] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<KanbanColumn>("todo");

  const projectsByColumn = useMemo(() => {
    const grouped: Record<KanbanColumn, Project[]> = {
      todo: [],
      in_progress: [],
      waiting: [],
      revisions: [],
      ready: [],
      completed: [],
    };

    projects.forEach((project) => {
      grouped[project.column].push(project);
    });

    return grouped;
  }, [projects]);

  const handleAddProject = () => {
    if (newTitle.trim()) {
      const deadline = newDeadline.trim() || new Date(Date.now() + 7 * 86400000).toISOString();
      addProject({
        title: newTitle.trim(),
        clientId: "",
        clientName: newClient.trim() || "Unassigned",
        deadline,
        revenue: parseFloat(newRevenue) || 0,
        notes: newNotes.trim(),
        column: selectedColumn,
      });
      resetForm();
      setModalVisible(false);
    }
  };

  const handleMoveProject = (column: KanbanColumn) => {
    if (selectedProject) {
      moveProject(selectedProject.id, column);
      setEditModalVisible(false);
      setSelectedProject(null);
    }
  };

  const handleDeleteProject = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      setEditModalVisible(false);
      setSelectedProject(null);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewClient("");
    setNewDeadline("");
    setNewRevenue("");
    setNewNotes("");
    setSelectedColumn("todo");
  };

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setEditModalVisible(true);
  };

  const renderColumn = ({ item }: { item: typeof columns[0] }) => {
    const columnProjects = projectsByColumn[item.key];
    
    return (
      <View style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={[styles.columnIndicator, { backgroundColor: item.color }]} />
          <ThemedText type="h4">{item.label}</ThemedText>
          <View style={[styles.countBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText type="small">{columnProjects.length}</ThemedText>
          </View>
        </View>
        <ScrollView
          style={[styles.columnContent, { backgroundColor: theme.backgroundDefault }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.columnContentContainer}
        >
          {columnProjects.length > 0 ? (
            columnProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => openEditModal(project)}
                onLongPress={() => openEditModal(project)}
              />
            ))
          ) : (
            <View style={styles.emptyColumn}>
              <Feather name="inbox" size={24} color={theme.textSecondary} />
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                No projects
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: headerHeight + Spacing.lg }]}>
        <FlatList
          data={columns}
          renderItem={renderColumn}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.columnsContainer,
            { paddingBottom: insets.bottom + 80 },
          ]}
          snapToInterval={280 + Spacing.md}
          decelerationRate="fast"
        />
      </View>

      <FAB icon="plus" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        title="New Project"
      >
        <FormInput
          label="Project Title"
          placeholder="Enter project title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <FormInput
          label="Client Name"
          placeholder="Enter client name"
          value={newClient}
          onChangeText={setNewClient}
        />
        <FormInput
          label="Revenue"
          placeholder="Enter project value"
          value={newRevenue}
          onChangeText={setNewRevenue}
          keyboardType="numeric"
        />
        <FormInput
          label="Notes"
          placeholder="Add notes"
          value={newNotes}
          onChangeText={setNewNotes}
          multiline
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Initial Column
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {columns.slice(0, 4).map((col) => (
              <Chip
                key={col.key}
                label={col.label}
                selected={selectedColumn === col.key}
                onPress={() => setSelectedColumn(col.key)}
              />
            ))}
          </View>
        </ScrollView>
        <Button onPress={handleAddProject}>Add Project</Button>
      </Modal>

      <Modal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedProject(null);
        }}
        title={selectedProject?.title || "Project"}
      >
        {selectedProject ? (
          <>
            <View style={styles.projectDetails}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Client: {selectedProject.clientName}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Revenue: ${selectedProject.revenue.toLocaleString()}
              </ThemedText>
              {selectedProject.notes ? (
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Notes: {selectedProject.notes}
                </ThemedText>
              ) : null}
            </View>
            <ThemedText type="h4" style={styles.moveLabel}>
              Move to:
            </ThemedText>
            <View style={styles.moveButtons}>
              {columns.map((col) => (
                <Pressable
                  key={col.key}
                  onPress={() => handleMoveProject(col.key)}
                  style={({ pressed }) => [
                    styles.moveButton,
                    {
                      backgroundColor:
                        selectedProject.column === col.key
                          ? col.color + "30"
                          : theme.backgroundSecondary,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    style={[styles.moveDot, { backgroundColor: col.color }]}
                  />
                  <ThemedText type="small">{col.label}</ThemedText>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={handleDeleteProject}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="trash-2" size={18} color={theme.error} />
              <ThemedText type="body" style={{ color: theme.error }}>
                Delete Project
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
  content: {
    flex: 1,
  },
  columnsContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  column: {
    width: 280,
  },
  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  columnIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  countBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginLeft: "auto",
  },
  columnContent: {
    flex: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  columnContentContainer: {
    gap: Spacing.sm,
  },
  emptyColumn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
    gap: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  projectDetails: {
    gap: Spacing.xs,
    padding: Spacing.lg,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: BorderRadius.md,
  },
  moveLabel: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  moveButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  moveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  moveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
