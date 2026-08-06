import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Roadmap } from '@/types';

interface Props {
  roadmap: Roadmap;
  onPress: () => void;
}

export function RoadmapCard({ roadmap, onPress }: Props) {
  const colors = useColors();

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
      <View style={[styles.leftBar, { backgroundColor: roadmap.color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.timelineBadge, { backgroundColor: roadmap.color + '22' }]}>
            <Feather name="clock" size={11} color={roadmap.color} />
            <Text style={[styles.timelineText, { color: roadmap.color, fontFamily: 'Inter_500Medium' }]}>
              {roadmap.estimatedTimeline}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.title, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>
          {roadmap.title}
        </Text>
        <View style={styles.tags}>
          {roadmap.careerApplications.slice(0, 2).map((app) => (
            <View key={app} style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {app}
              </Text>
            </View>
          ))}
          {roadmap.careerApplications.length > 2 && (
            <View style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[styles.tagText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                +{roadmap.careerApplications.length - 2}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftBar: { width: 4 },
  content: { flex: 1, padding: 14, gap: 7 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timelineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timelineText: { fontSize: 11 },
  title: { fontSize: 15, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11 },
});
