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
import { getExamById } from '@/data';

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

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const exam = getExamById(id ?? '');

  if (!exam) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Exam not found
        </Text>
      </View>
    );
  }

  const accentColor = CATEGORY_COLOR[exam.category] ?? colors.primary;

  return (
    <>
      <Stack.Screen options={{ title: exam.name }} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: accentColor, paddingTop: 20 }]}>
          <View style={[styles.heroCategoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.heroCategoryText, { fontFamily: 'Inter_500Medium' }]}>{exam.category}</Text>
          </View>
          <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]}>{exam.name}</Text>
          <Text style={[styles.heroConductedBy, { fontFamily: 'Inter_400Regular' }]}>{exam.conductedBy}</Text>
          <View style={styles.heroStats}>
            <HeroStat icon="clock" label="Duration" value={exam.examPattern.duration} />
            <View style={styles.heroStatDivider} />
            <HeroStat icon="star" label="Total Marks" value={String(exam.examPattern.totalMarks)} />
            <View style={styles.heroStatDivider} />
            <HeroStat icon="users" label="Age Limit" value={exam.ageLimit} />
          </View>
        </View>

        {/* Overview */}
        <Section title="Overview" colors={colors}>
          <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
            {exam.overview}
          </Text>
        </Section>

        {/* Eligibility */}
        <Section title="Eligibility" colors={colors}>
          <View style={[styles.infoCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Feather name="check-circle" size={16} color={accentColor} />
            <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular', flex: 1 }]}>
              {exam.eligibility}
            </Text>
          </View>
        </Section>

        {/* Exam Pattern */}
        <Section title="Exam Pattern" colors={colors}>
          <View style={styles.patternGrid}>
            {exam.examPattern.sections.map((sec, i) => (
              <View key={i} style={[styles.patternCard, { backgroundColor: accentColor + '18', borderColor: accentColor + '44' }]}>
                <Text style={[styles.patternMarks, { color: accentColor, fontFamily: 'Poppins_700Bold' }]}>
                  {sec.marks}
                </Text>
                <Text style={[styles.patternLabel, { color: colors.foreground, fontFamily: 'Inter_500Medium' }]} numberOfLines={2}>
                  {sec.name}
                </Text>
              </View>
            ))}
          </View>
          <View style={[styles.qTypesCard, { backgroundColor: colors.muted }]}>
            <Text style={[styles.qTypesTitle, { color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }]}>
              Question Types
            </Text>
            {exam.examPattern.questionTypes.map((qt, i) => (
              <Text key={i} style={[styles.qType, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
                • {qt}
              </Text>
            ))}
          </View>
        </Section>

        {/* Syllabus */}
        <Section title="Syllabus" colors={colors}>
          {exam.syllabus.map((section, i) => (
            <Pressable
              key={i}
              onPress={() => setExpandedSection(expandedSection === i ? null : i)}
              style={[styles.syllabusCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.syllabusHeader}>
                <Text style={[styles.syllabusSection, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', flex: 1 }]}>
                  {section.section}
                </Text>
                <View style={[styles.topicCount, { backgroundColor: accentColor + '22' }]}>
                  <Text style={[styles.topicCountText, { color: accentColor, fontFamily: 'Inter_500Medium' }]}>
                    {section.topics.length}
                  </Text>
                </View>
                <Feather
                  name={expandedSection === i ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={colors.mutedForeground}
                />
              </View>
              {expandedSection === i && (
                <View style={styles.syllabusTopics}>
                  {section.topics.map((topic, j) => (
                    <Text key={j} style={[styles.syllabusTopicText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                      · {topic}
                    </Text>
                  ))}
                </View>
              )}
            </Pressable>
          ))}
        </Section>

        {/* Preparation Tips */}
        <Section title="Preparation Tips" colors={colors}>
          {exam.preparationTips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipNum, { backgroundColor: accentColor }]}>
                <Text style={[styles.tipNumText, { fontFamily: 'Inter_700Bold' }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.foreground, fontFamily: 'Inter_400Regular', flex: 1 }]}>
                {tip}
              </Text>
            </View>
          ))}
        </Section>

        {/* Recommended Books */}
        {exam.recommendedBooks.length > 0 && (
          <Section title="Recommended Books" colors={colors}>
            {exam.recommendedBooks.map((book, i) => (
              <View key={i} style={[styles.bookCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Feather name="book" size={16} color={accentColor} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                    {book.title}
                  </Text>
                  <Text style={[styles.bookMeta, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {book.author} · {book.subject}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {/* Career Opportunities */}
        {exam.careerOpportunities.length > 0 && (
          <Section title="Career Opportunities" colors={colors}>
            {exam.careerOpportunities.map((opp, i) => (
              <View key={i} style={styles.oppRow}>
                <View style={[styles.oppDot, { backgroundColor: accentColor }]} />
                <Text style={[styles.oppText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
                  {opp}
                </Text>
              </View>
            ))}
          </Section>
        )}
      </ScrollView>
    </>
  );
}

function HeroStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.heroStat}>
      <Feather name={icon as never} size={13} color="rgba(255,255,255,0.7)" />
      <Text style={[styles.heroStatLabel, { fontFamily: 'Inter_400Regular' }]}>{label}</Text>
      <Text style={[styles.heroStatValue, { fontFamily: 'Inter_500Medium' }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
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
  hero: { paddingHorizontal: 20, paddingBottom: 28, gap: 6 },
  heroCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 2,
  },
  heroCategoryText: { color: '#fff', fontSize: 12 },
  heroName: { color: '#fff', fontSize: 22, lineHeight: 30 },
  heroConductedBy: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 19 },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  heroStatValue: { color: '#fff', fontSize: 12, textAlign: 'center' },

  /* Sections */
  section: { paddingHorizontal: 16, paddingTop: 22, gap: 10 },
  sectionTitle: { fontSize: 17, marginBottom: 2 },
  bodyText: { fontSize: 14, lineHeight: 22 },

  infoCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },

  /* Pattern */
  patternGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  patternCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    minWidth: 100,
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  patternMarks: { fontSize: 22 },
  patternLabel: { fontSize: 12, textAlign: 'center' },
  qTypesCard: {
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  qTypesTitle: { fontSize: 12, marginBottom: 4 },
  qType: { fontSize: 13 },

  /* Syllabus */
  syllabusCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 6,
  },
  syllabusHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  syllabusSection: { fontSize: 14, lineHeight: 20 },
  topicCount: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  topicCountText: { fontSize: 11 },
  syllabusTopics: { marginTop: 10, gap: 4 },
  syllabusTopicText: { fontSize: 13, lineHeight: 19 },

  /* Tips */
  tipRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 8 },
  tipNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipNumText: { color: '#fff', fontSize: 12 },
  tipText: { fontSize: 14, lineHeight: 21 },

  /* Books */
  bookCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 6,
  },
  bookTitle: { fontSize: 14, marginBottom: 2 },
  bookMeta: { fontSize: 12 },

  /* Opportunities */
  oppRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 6 },
  oppDot: { width: 7, height: 7, borderRadius: 4, marginTop: 7 },
  oppText: { flex: 1, fontSize: 14, lineHeight: 21 },
});
