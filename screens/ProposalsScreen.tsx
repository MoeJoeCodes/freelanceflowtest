import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { FormInput } from "@/components/FormInput";
import { Chip } from "@/components/Chip";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { useDataStore, TemplateCategory } from "@/store/dataStore";

const categories: { key: TemplateCategory; label: string }[] = [
  { key: "design", label: "Design" },
  { key: "admin", label: "Admin" },
  { key: "real_estate", label: "Real Estate" },
  { key: "bpo", label: "BPO" },
  { key: "tutoring", label: "Tutoring" },
];

export default function ProposalsScreen() {
  const { theme } = useTheme();
  const { templates } = useDataStore();
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("design");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const extractKeywords = (text: string): string[] => {
    const commonWords = new Set([
      "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
      "have", "has", "had", "do", "does", "did", "will", "would", "could",
      "should", "may", "might", "must", "shall", "can", "need", "dare",
      "to", "of", "in", "for", "on", "with", "at", "by", "from", "up",
      "about", "into", "through", "during", "before", "after", "above",
      "below", "between", "under", "again", "further", "then", "once",
      "and", "but", "or", "nor", "so", "yet", "both", "either", "neither",
      "not", "only", "own", "same", "than", "too", "very", "just", "i",
      "me", "my", "we", "our", "you", "your", "he", "him", "his", "she",
      "her", "it", "its", "they", "them", "their", "what", "which", "who",
      "this", "that", "these", "those", "am", "looking", "need", "want",
    ]);

    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const wordCounts = new Map<string, number>();
    
    words.forEach((word) => {
      if (!commonWords.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      }
    });

    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  };

  const generateProposal = () => {
    if (!jobDescription.trim()) {
      setToastMessage("Please enter a job description");
      setToastVisible(true);
      return;
    }

    const template = templates.find((t) => t.category === selectedCategory);
    const extractedKeywords = extractKeywords(jobDescription);
    setKeywords(extractedKeywords);

    const keywordMention = extractedKeywords.length > 0
      ? `I noticed you're looking for expertise in ${extractedKeywords.slice(0, 3).join(", ")}. `
      : "";

    const proposal = `${keywordMention}${template?.template || "I'm excited to work on your project. Let's discuss the details and create something amazing together!"}`;
    
    setGeneratedProposal(proposal);
  };

  const copyToClipboard = async () => {
    if (!generatedProposal) {
      setToastMessage("Generate a proposal first");
      setToastVisible(true);
      return;
    }

    await Clipboard.setStringAsync(generatedProposal);
    setToastMessage("Copied to clipboard");
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScreenKeyboardAwareScrollView>
        <ThemedText type="h2" style={styles.title}>
          Proposal Generator
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Paste a job description and generate a customized proposal
        </ThemedText>

        <FormInput
          label="Job Description"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChangeText={setJobDescription}
          multiline
          style={styles.textArea}
        />

        <ThemedText type="h4" style={styles.sectionLabel}>
          Template Category
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              selected={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            />
          ))}
        </ScrollView>

        <Button onPress={generateProposal} style={styles.generateButton}>
          Generate Proposal
        </Button>

        {keywords.length > 0 ? (
          <View style={styles.keywordsSection}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Detected Keywords:
            </ThemedText>
            <View style={styles.keywordTags}>
              {keywords.map((keyword, index) => (
                <View
                  key={index}
                  style={[styles.keywordTag, { backgroundColor: theme.primary + "20" }]}
                >
                  <ThemedText type="small" style={{ color: theme.primary }}>
                    {keyword}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {generatedProposal ? (
          <View style={styles.proposalSection}>
            <ThemedText type="h4" style={styles.sectionLabel}>
              Generated Proposal
            </ThemedText>
            <View
              style={[
                styles.proposalContainer,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <ThemedText type="body" style={styles.proposalText}>
                {generatedProposal}
              </ThemedText>
            </View>
            <Button onPress={copyToClipboard} style={styles.copyButton}>
              Copy to Clipboard
            </Button>
          </View>
        ) : null}
      </ScreenKeyboardAwareScrollView>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
        type={toastMessage.includes("Copied") ? "success" : "info"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.xl,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  sectionLabel: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  chipContainer: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  generateButton: {
    marginTop: Spacing.xl,
  },
  keywordsSection: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  keywordTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  keywordTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  proposalSection: {
    marginTop: Spacing.xl,
  },
  proposalContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  proposalText: {
    lineHeight: 24,
  },
  copyButton: {
    marginTop: Spacing.lg,
  },
});
