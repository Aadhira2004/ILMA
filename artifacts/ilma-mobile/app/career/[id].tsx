import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getCareerById, CATEGORY_COLORS } from '@/data';

export default function CareerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const career = getCareerById(id ?? '');

  if (!career) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Career not found
        </Text>
      </View>
    );
  }

  const accentColor = CATEGORY_COLORS[career.category] ?? colors.primary;

  return (
    <>
      <Stack.Screen options={{ title: career.name }} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: accentColor, paddingTop: 20 }]}>
          <View style={[styles.heroCategoryBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.heroCategoryText, { fontFamily: 'Inter_500Medium' }]}>
              {career.category}
            </Text>
          </View>
          <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]}>{career.name}</Text>
          <Text style={[styles.heroShort, { fontFamily: 'Inter_400Regular' }]} numberOfLines={3}>
            {career.shortDescription}
          </Text>
          <View style={styles.heroStats}>
            <HeroStat icon="trending-up" label="India" value={career.salary} />
            <View style={styles.heroStatDivider} />
            <HeroStat icon="globe" label="Abroad" value={career.salaryAbroad} />
            <View style={styles.heroStatDivider} />
            <HeroStat icon="star" label="Future Scope" value={`${career.futureScopeRating}/5`} />
          </View>
        </View>

        {/* Overview */}
        <Section title="Overview" colors={colors}>
          <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
            {career.overview}
          </Text>
        </Section>

        {/* Responsibilities */}
        <Section title="Key Responsibilities" colors={colors}>
          {career.responsibilities.map((r, i) => (
            <BulletItem key={i} text={r} colors={colors} color={accentColor} />
          ))}
        </Section>

        {/* Skills */}
        <Section title="Skills Required" colors={colors}>
          <View style={styles.tagWrap}>
            {career.skillsRequired.map((s) => (
              <Tag key={s} text={s} colors={colors} color={accentColor} />
            ))}
          </View>
        </Section>

        {/* Tools */}
        <Section title="Tools Used" colors={colors}>
          <View style={styles.tagWrap}>
            {career.toolsUsed.map((t) => (
              <Tag key={t} text={t} colors={colors} color={colors.teal} />
            ))}
          </View>
        </Section>

        {/* Top Recruiters */}
        <Section title="Top Recruiters" colors={colors}>
          <View style={styles.tagWrap}>
            {career.topRecruiters.map((r) => (
              <Tag key={r} text={r} colors={colors} color={colors.primary} />
            ))}
          </View>
        </Section>

        {/* Career Growth */}
        <Section title="Career Growth Path" colors={colors}>
          {career.careerGrowth.map((g, i) => (
            <View key={i} style={styles.growthItem}>
              <View style={styles.growthTimeline}>
                <View style={[styles.growthDot, { backgroundColor: accentColor }]} />
                {i < career.careerGrowth.length - 1 && (
                  <View style={[styles.growthLine, { backgroundColor: colors.border }]} />
                )}
              </View>
              <View style={[styles.growthCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.growthStage, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                  {g.stage}
                </Text>
                <Text style={[styles.growthYears, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                  {g.years}
                </Text>
                <Text style={[styles.growthSalary, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
                  {g.salary}
                </Text>
              </View>
            </View>
          ))}
        </Section>

        {/* Future Scope */}
        <Section title="Future Scope" colors={colors}>
          <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
            {career.futureScope}
          </Text>
        </Section>

        {/* Who Should Choose */}
        <Section title="Who Should Choose This?" colors={colors}>
          {career.whoShouldChoose.map((w, i) => (
            <BulletItem key={i} text={w} colors={colors} color={colors.teal} />
          ))}
        </Section>

        {/* Day in Life */}
        <Section title="A Day in the Life" colors={colors}>
          <View style={[styles.dayCard, { backgroundColor: colors.accent, borderColor: colors.accentForeground + '22' }]}>
            <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
              {career.dayInLife}
            </Text>
          </View>
        </Section>

        {/* Higher Studies */}
        {career.higherStudies.length > 0 && (
          <Section title="Higher Studies" colors={colors}>
            <View style={styles.tagWrap}>
              {career.higherStudies.map((h) => (
                <Tag key={h} text={h} colors={colors} color={colors.primary} />
              ))}
            </View>
          </Section>
        )}

        {/* Certifications */}
        {career.certifications.length > 0 && (
          <Section title="Certifications" colors={colors}>
            {career.certifications.map((c, i) => (
              <BulletItem key={i} text={c} colors={colors} color={colors.teal} />
            ))}
          </Section>
        )}

        {/* FAQs */}
        {career.faqs.length > 0 && (
          <Section title="FAQs" colors={colors}>
            {career.faqs.map((faq, i) => (
              <Pressable
                key={i}
                onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                style={[styles.faqItem, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.foreground, fontFamily: 'Inter_600SemiBold', flex: 1 }]}>
                    {faq.question}
                  </Text>
                  <Feather
                    name={expandedFaq === i ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.mutedForeground}
                  />
                </View>
                {expandedFaq === i && (
                  <Text style={[styles.faqAnswer, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {faq.answer}
                  </Text>
                )}
              </Pressable>
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
      <Text style={[styles.heroStatValue, { fontFamily: 'Inter_600SemiBold' }]}>{value}</Text>
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

function BulletItem({
  text,
  colors,
  color,
}: {
  text: string;
  colors: ReturnType<typeof useColors>;
  color: string;
}) {
  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text style={[styles.bulletText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
        {text}
      </Text>
    </View>
  );
}

function Tag({
  text,
  colors,
  color,
}: {
  text: string;
  colors: ReturnType<typeof useColors>;
  color: string;
}) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '18', borderColor: color + '44' }]}>
      <Text style={[styles.tagText, { color, fontFamily: 'Inter_500Medium' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16 },

  /* Hero */
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 8,
  },
  heroCategoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 2,
  },
  heroCategoryText: { color: '#fff', fontSize: 12 },
  heroName: { color: '#fff', fontSize: 26, lineHeight: 34 },
  heroShort: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 21 },
  heroStats: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  heroStatValue: { color: '#fff', fontSize: 13, textAlign: 'center' },

  /* Sections */
  section: { paddingHorizontal: 16, paddingTop: 22, gap: 10 },
  sectionTitle: { fontSize: 17, marginBottom: 2 },
  bodyText: { fontSize: 14, lineHeight: 22 },

  /* Tags */
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  tagText: { fontSize: 12 },

  /* Bullets */
  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 21 },

  /* Growth */
  growthItem: { flexDirection: 'row', gap: 12 },
  growthTimeline: { alignItems: 'center', width: 20 },
  growthDot: { width: 12, height: 12, borderRadius: 6, marginTop: 12 },
  growthLine: { width: 2, flex: 1, marginVertical: 2 },
  growthCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 2,
  },
  growthStage: { fontSize: 14 },
  growthYears: { fontSize: 12 },
  growthSalary: { fontSize: 14 },

  /* Day */
  dayCard: { borderRadius: 10, borderWidth: 1, padding: 14 },

  /* FAQs */
  faqItem: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
    gap: 6,
  },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  faqQuestion: { fontSize: 14, lineHeight: 20 },
  faqAnswer: { fontSize: 13, lineHeight: 20 },
});
