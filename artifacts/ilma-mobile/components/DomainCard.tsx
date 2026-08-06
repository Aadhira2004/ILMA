import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { Domain } from '@/types';

interface Props {
  domain: Domain;
  onPress: () => void;
}

export function DomainCard({ domain, onPress }: Props) {
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
      {/* Top accent strip */}
      <View style={[styles.topStrip, { backgroundColor: domain.color }]} />
      <View style={styles.content}>
        {/* Icon circle */}
        <View style={[styles.iconCircle, { backgroundColor: domain.color + '22' }]}>
          <Feather
            name="activity"
            size={20}
            color={domain.color}
          />
        </View>
        <Text style={[styles.name, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
          {domain.name}
        </Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]} numberOfLines={2}>
          {domain.tagline}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.careerCount, { color: domain.color, fontFamily: 'Inter_500Medium' }]}>
            {domain.careerOpportunities.length} careers
          </Text>
          <Feather name="arrow-right" size={14} color={domain.color} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
  },
  topStrip: { height: 4 },
  content: { padding: 14, gap: 6 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  name: { fontSize: 14, lineHeight: 20 },
  tagline: { fontSize: 12, lineHeight: 17 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  careerCount: { fontSize: 12 },
});
