import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { CATEGORY_COLORS } from '@/data';
import type { Career } from '@/types';

interface Props {
  career: Career;
  onPress: () => void;
  /** Compact mode: smaller width card for horizontal scroll */
  compact?: boolean;
}

function ScopeRating({ value, colors }: { value: number; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.ratingRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.ratingDot,
            {
              backgroundColor:
                i < Math.round(value) ? colors.teal : colors.border,
            },
          ]}
        />
      ))}
      <Text style={[styles.ratingText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
        {value}
      </Text>
    </View>
  );
}

export function CareerCard({ career, onPress, compact }: Props) {
  const colors = useColors();
  const accentColor = CATEGORY_COLORS[career.category] ?? colors.primary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (compact) {
    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.compactCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderTopColor: accentColor,
          },
          pressed && { opacity: 0.82 },
        ]}
      >
        <View style={[styles.compactCategoryBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.badgeText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
            {career.category}
          </Text>
        </View>
        <Text style={[styles.compactName, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>
          {career.name}
        </Text>
        <Text style={[styles.compactSalary, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
          {career.salary}
        </Text>
        <ScopeRating value={career.futureScopeRating} colors={colors} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.fullCard,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.fullContent}>
        <View style={styles.fullHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: colors.muted }]}>
            <Text style={[styles.badgeText, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              {career.category}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.fullName, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
          {career.name}
        </Text>
        <Text style={[styles.salary, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
          {career.salary}
          <Text style={[styles.salaryAbroad, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {' '}· {career.salaryAbroad}
          </Text>
        </Text>
        <Text
          style={[styles.description, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}
          numberOfLines={2}
        >
          {career.shortDescription}
        </Text>
        <ScopeRating value={career.futureScopeRating} colors={colors} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /* Compact */
  compactCard: {
    width: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderTopWidth: 3,
    padding: 14,
    marginRight: 12,
    gap: 6,
  },
  compactCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  compactName: { fontSize: 14, lineHeight: 20 },
  compactSalary: { fontSize: 13 },

  /* Full */
  fullCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accentBar: { width: 4 },
  fullContent: { flex: 1, padding: 14, gap: 5 },
  fullHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fullName: { fontSize: 16, lineHeight: 22 },
  salary: { fontSize: 14 },
  salaryAbroad: { fontSize: 13 },
  description: { fontSize: 13, lineHeight: 19 },

  /* Shared */
  badgeText: { fontSize: 11 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingDot: { width: 7, height: 7, borderRadius: 4 },
  ratingText: { fontSize: 12, marginLeft: 2 },
});
