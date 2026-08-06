import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Exam } from '@/types';

interface Props {
  exam: Exam;
  onPress: () => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  National: '#0F4C81',
  'National / Defense': '#8B5CF6',
  'Defense / Research': '#F59E0B',
  'Nuclear / Research': '#10B981',
  'Academia / Research': '#EC4899',
  'Healthcare Institutions': '#1AB7B0',
  'Central Government': '#3B82F6',
  Railways: '#F43F5E',
  'State Government': '#6366F1',
};

export function ExamCard({ exam, onPress }: Props) {
  const colors = useColors();
  const categoryColor = CATEGORY_COLOR[exam.category] ?? colors.primary;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.82 },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '22' }]}>
          <Text style={[styles.categoryText, { color: categoryColor, fontFamily: 'Inter_600SemiBold' }]}>
            {exam.category}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.name, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>
        {exam.name}
      </Text>
      <Text style={[styles.conductedBy, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]} numberOfLines={1}>
        {exam.conductedBy}
      </Text>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
            {exam.examPattern.duration}
          </Text>
        </View>
        {typeof exam.examPattern.totalMarks === 'number' && (
          <View style={styles.metaItem}>
            <Feather name="star" size={12} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
              {exam.examPattern.totalMarks} marks
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryText: { fontSize: 11 },
  name: { fontSize: 15, lineHeight: 21 },
  conductedBy: { fontSize: 12, lineHeight: 17 },
  meta: { flexDirection: 'row', gap: 14, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
});
