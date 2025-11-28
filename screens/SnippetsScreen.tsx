import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SnippetCard } from "@/components/SnippetCard";
import { Modal } from "@/components/Modal";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Toast } from "@/components/Toast";
import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, Snippet, SnippetCategory } from "@/store/dataStore";

const categories: { key: SnippetCategory; label: string }[] = [
  { key: "intros", label: "Intros" },
  { key: "follow_ups", label: "Follow-ups" },
  { key: "delivery", label: "Delivery" },
  { key: "portfolio", label: "Portfolio" },
  { key: "quick_replies", label: "Quick Replies" },
];

export default function SnippetsScreen() {
  const { theme } = useTheme();
  const { paddingTop, paddingBottom } = useScreenInsets();
  const { snippets, addSnippet, updateSnippet, deleteSnippet } = useDataStore();
  const [selectedCategory, setSelectedCategory] = useState<SnippetCategory | "all">("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<SnippetCategory>("intros");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const filteredSnippets = useMemo(() => {
    if (selectedCategory === "all") return snippets;
    return snippets.filter((s) => s.category === selectedCategory);
  }, [snippets, selectedCategory]);

  const handleAddSnippet = () => {
    if (newTitle.trim() && newContent.trim()) {
      addSnippet({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
      });
      resetForm();
      setModalVisible(false);
      setToastMessage("Snippet added");
      setToastVisible(true);
    }
  };

  const handleCopySnippet = async (snippet: Snippet) => {
    await Clipboard.setStringAsync(snippet.content);
    setToastMessage("Copied to clipboard");
    setToastVisible(true);
  };

  const handleDeleteSnippet = () => {
    if (selectedSnippet) {
      deleteSnippet(selectedSnippet.id);
      setEditModalVisible(false);
      setSelectedSnippet(null);
      setToastMessage("Snippet deleted");
      setToastVisible(true);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setNewCategory("intros");
  };

  const openEditModal = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setEditModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerRow}>
        <ThemedText type="h2">Snippets</ThemedText>
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
        contentContainerStyle={styles.categoryContainer}
      >
        <Chip
          label="All"
          selected={selectedCategory === "all"}
          onPress={() => setSelectedCategory("all")}
        />
        {categories.map((cat) => (
          <Chip
            key={cat.key}
            label={cat.label}
            selected={selectedCategory === cat.key}
            onPress={() => setSelectedCategory(cat.key)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderSnippet = ({ item }: { item: Snippet }) => (
    <SnippetCard
      snippet={item}
      onCopy={() => handleCopySnippet(item)}
      onLongPress={() => openEditModal(item)}
    />
  );

  const renderEmpty = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name="clipboard" size={48} color={theme.textSecondary} />
      <ThemedText type="h4" style={{ color: theme.textSecondary }}>
        No snippets yet
      </ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        Save frequently used text for quick access
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredSnippets}
        renderItem={renderSnippet}
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
        title="New Snippet"
      >
        <FormInput
          label="Title"
          placeholder="Enter snippet title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <FormInput
          label="Content"
          placeholder="Enter snippet content..."
          value={newContent}
          onChangeText={setNewContent}
          multiline
          style={styles.contentInput}
        />
        <ThemedText type="small" style={[styles.label, { color: theme.textSecondary }]}>
          Category
        </ThemedText>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              selected={newCategory === cat.key}
              onPress={() => setNewCategory(cat.key)}
            />
          ))}
        </View>
        <Button onPress={handleAddSnippet}>Add Snippet</Button>
      </Modal>

      <Modal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedSnippet(null);
        }}
        title={selectedSnippet?.title || "Snippet"}
      >
        {selectedSnippet ? (
          <>
            <View style={styles.snippetDetails}>
              <ThemedText type="body">{selectedSnippet.content}</ThemedText>
            </View>

            <Pressable
              onPress={() => {
                handleCopySnippet(selectedSnippet);
                setEditModalVisible(false);
                setSelectedSnippet(null);
              }}
              style={({ pressed }) => [
                styles.copyButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="copy" size={18} color="#FFFFFF" />
              <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                Copy to Clipboard
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleDeleteSnippet}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="trash-2" size={18} color={theme.error} />
              <ThemedText type="body" style={{ color: theme.error }}>
                Delete Snippet
              </ThemedText>
            </Pressable>
          </>
        ) : null}
      </Modal>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type="success"
      />
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
  categoryContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
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
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  contentInput: {
    height: 150,
  },
  snippetDetails: {
    padding: Spacing.lg,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: BorderRadius.md,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
  },
});
