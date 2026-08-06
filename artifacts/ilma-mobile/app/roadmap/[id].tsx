import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getRoadmapById } from '@/data';
import type { RoadmapLevel } from '@/types';

const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const LEVEL_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const LEVEL_ICONS = { beginner: 'sunrise', intermediate: 'sun', advanced: 'zap' } as const;

export default function RoadmapDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [activeLevel, setActiveLevel] = useState<typeof LEVELS[number]>('beginner');

  const roadmap = getRoadmapById(id ?? '');

  if (!roadmap) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Roadmap not found
        </Text>
      </View>
    );
  }

  const level: RoadmapLevel = roadmap[activeLevel];

  return (
    <>
      <Stack.Screen options={{ title: roadmap.title }} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: roadmap.color, paddingTop: 20 }]}>
          <Text style={[styles.heroTitle, { fontFamily: 'Poppins_700Bold' }]}>{roadmap.title}</Text>
          <View style={styles.heroMeta}>
            <View style={[styles.heroBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="clock" size={12} color="#fff" />
              <Text style={[styles.heroBadgeText, { fontFamily: 'Inter_500Medium' }]}>
                {roadmap.estimatedTimeline}
              </Text>
            </View>
          </View>
          <View style={styles.careerApps}>
            {roadmap.careerApplications.map((app) => (
              <View key={app} style={[styles.appTag, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
                <Text style={[styles.appTagText, { fontFamily: 'Inter_400Regular' }]}>{app}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Level Switcher */}
        <View style={[styles.levelSwitcher, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          {LEVELS.map((lvl) => (
            <Pressable
              key={lvl}
              onPress={() => setActiveLevel(lvl)}
              style={[
                styles.levelTab,
                activeLevel === lvl && { backgroundColor: roadmap.color },
              ]}
            >
              <Feather
                name={LEVEL_ICONS[lvl]}
                size={14}
                color={activeLevel === lvl ? '#fff' : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.levelTabText,
                  { fontFamily: 'Inter_500Medium' },
                  activeLevel === lvl ? { color: '#fff' } : { color: colors.mutedForeground },
                ]}
              >
                {LEVEL_LABELS[lvl]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Level Content */}
        <View style={styles.levelContent}>
          <View style={[styles.levelHeader, { backgroundColor: roadmap.color + '18', borderColor: roadmap.color + '44' }]}>
            <Text style={[styles.levelTitle, { color: roadmap.color, fontFamily: 'Poppins_600SemiBold' }]}>
              {level.title}
            </Text>
            <View style={[styles.durationBadge, { backgroundColor: roadmap.color + '33' }]}>
              <Feather name="clock" size={11} color={roadmap.color} />
              <Text style={[styles.durationText, { color: roadmap.color, fontFamily: 'Inter_500Medium' }]}>
                {level.duration}
              </Text>
            </View>
          </View>

          {/* Topics */}
          <Section title="Topics to Cover" colors={colors}>
            {level.topics.map((topic, i) => (
              <View key={i} style={styles.topicRow}>
                <View style={[styles.topicNum, { backgroundColor: roadmap.color }]}>
                  <Text style={[styles.topicNumText, { fontFamily: 'Inter_600SemiBold' }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.topicText, { color: colors.foreground, fontFamily: 'Inter_400Regular', flex: 1 }]}>
                  {topic}
                </Text>
              </View>
            ))}
          </Section>

          {/* Project */}
          <Section title="Capstone Project" colors={colors}>
            <View style={[styles.projectCard, { backgroundColor: roadmap.color + '18', borderColor: roadmap.color + '33' }]}>
              <Feather name="code" size={18} color={roadmap.color} />
              <Text style={[styles.projectText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
                {level.project}
              </Text>
            </View>
          </Section>

          {/* Resources */}
          {level.resources.length > 0 && (
            <Section title="Resources" colors={colors}>
              {level.resources.map((res, i) => (
                <View key={i} style={[styles.resourceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.resourceTypeBadge, {
                    backgroundColor: res.type === 'free' ? colors.teal + '22' : colors.primary + '22',
                  }]}>
                    <Text style={[styles.resourceTypeText, {
                      color: res.type === 'free' ? colors.teal : colors.primary,
                      fontFamily: 'Inter_600SemiBold',
                    }]}>
                      {res.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.resourceName, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                    {res.name}
                  </Text>
                </View>
              ))}
            </Section>
          )}
        </View>

        {/* Certifications */}
        {roadmap.certifications.length > 0 && (
          <View style={[styles.certSection, { paddingHorizontal: 16 }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
              Certifications
            </Text>
            {roadmap.certifications.map((cert, i) => (
              <View key={i} style={[styles.certCard, { backgroundColor: colors.accent, borderColor: colors.accentForeground + '22' }]}>
                <Feather name="award" size={16} color={colors.primary} />
                <Text style={[styles.certText, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]}>
                  {cert}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Practice Projects */}
        {roadmap.projects.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 22 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
              Practice Projects
            </Text>
            {roadmap.projects.map((proj, i) => (
              <View key={i} style={[styles.practiceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.practiceTop}>
                  <Text style={[styles.projectName, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                    {proj.name}
                  </Text>
                  <View style={[styles.diffBadge, {
                    backgroundColor: proj.difficulty === 'advanced'
                      ? '#F43F5E22'
                      : proj.difficulty === 'intermediate'
                      ? '#F59E0B22'
                      : '#10B98122',
                  }]}>
                    <Text style={[styles.diffText, {
                      color: proj.difficulty === 'advanced'
                        ? '#F43F5E'
                        : proj.difficulty === 'intermediate'
                        ? '#F59E0B'
                        : '#10B981',
                      fontFamily: 'Inter_500Medium',
                    }]}>
                      {proj.difficulty}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.projectDesc, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  {proj.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

function Section({
  title,
  colors,
  children,
}: {
  title: string;
  colors: ReturnType<typeof useColors>;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16 },

  /* Hero */
  hero: { paddingHorizontal: 20, paddingBottom: 28, gap: 8 },
  heroTitle: { color: '#fff', fontSize: 24, lineHeight: 32 },
  heroMeta: { flexDirection: 'row', gap: 8 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroBadgeText: { color: '#fff', fontSize: 13 },
  careerApps: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  appTag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  appTagText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },

  /* Level switcher */
  levelSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 4,
    gap: 4,
  },
  levelTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 8,
  },
  levelTabText: { fontSize: 12 },

  /* Level content */
  levelContent: { padding: 16, gap: 0 },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 4,
  },
  levelTitle: { fontSize: 16 },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: { fontSize: 12 },

  /* Section */
  section: { paddingTop: 18, gap: 8 },
  sectionTitle: { fontSize: 16, marginBottom: 2 },

  /* Topics */
  topicRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  topicNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicNumText: { color: '#fff', fontSize: 11 },
  topicText: { fontSize: 14, lineHeight: 21 },

  /* Project */
  projectCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  projectText: { flex: 1, fontSize: 14, lineHeight: 21 },

  /* Resources */
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 6,
  },
  resourceTypeBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  resourceTypeText: { fontSize: 10 },
  resourceName: { flex: 1, fontSize: 13 },

  /* Certs */
  certSection: { paddingTop: 22, gap: 8 },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 6,
  },
  certText: { flex: 1, fontSize: 14 },

  /* Practice */
  practiceCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
    gap: 6,
  },
  practiceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectName: { fontSize: 14, flex: 1 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  diffText: { fontSize: 11 },
  projectDesc: { fontSize: 13, lineHeight: 19 },
});
