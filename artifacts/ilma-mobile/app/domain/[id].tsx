import React from 'react';
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
import { getDomainById, getCareerById } from '@/data';

export default function DomainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const router = useRouter();

  const domain = getDomainById(id ?? '');

  if (!domain) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          Domain not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: domain.name }} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: domain.color, paddingTop: 20 }]}>
          <Text style={[styles.heroName, { fontFamily: 'Poppins_700Bold' }]}>{domain.name}</Text>
          <Text style={[styles.heroTagline, { fontFamily: 'Inter_400Regular' }]}>{domain.tagline}</Text>
          <View style={[styles.heroMeta, { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
            <MetaItem icon="users" value={`${domain.careerOpportunities.length} careers`} />
            <View style={styles.metaDivider} />
            <MetaItem icon="book-open" value={`${domain.coreSubjects.length} core subjects`} />
            <View style={styles.metaDivider} />
            <MetaItem icon="layers" value={`${domain.applications.length} applications`} />
          </View>
        </View>

        {/* Overview */}
        <Section title="Overview" colors={colors}>
          <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
            {domain.overview}
          </Text>
        </Section>

        {/* Core Subjects */}
        <Section title="Core Subjects" colors={colors}>
          <View style={styles.pillWrap}>
            {domain.coreSubjects.map((s) => (
              <Pill key={s} text={s} color={domain.color} />
            ))}
          </View>
        </Section>

        {/* Applications */}
        <Section title="Applications" colors={colors}>
          {domain.applications.map((a, i) => (
            <BulletItem key={i} text={a} color={domain.color} colors={colors} />
          ))}
        </Section>

        {/* Skills Required */}
        <Section title="Skills Required" colors={colors}>
          <View style={styles.pillWrap}>
            {domain.skillsRequired.map((s) => (
              <Pill key={s} text={s} color={colors.teal} />
            ))}
          </View>
        </Section>

        {/* Industries */}
        <Section title="Industries" colors={colors}>
          <View style={styles.pillWrap}>
            {domain.industries.map((ind) => (
              <Pill key={ind} text={ind} color={colors.primary} />
            ))}
          </View>
        </Section>

        {/* Future Scope */}
        <Section title="Future Scope" colors={colors}>
          <View style={[styles.futureCard, { backgroundColor: domain.color + '18', borderColor: domain.color + '44' }]}>
            <Text style={[styles.bodyText, { color: colors.foreground, fontFamily: 'Inter_400Regular' }]}>
              {domain.futureScope}
            </Text>
          </View>
        </Section>

        {/* Career Opportunities */}
        {domain.careerOpportunities.length > 0 && (
          <Section title="Career Opportunities" colors={colors}>
            {domain.careerOpportunities.map((cId) => {
              const career = getCareerById(cId);
              if (!career) return null;
              return (
                <Pressable
                  key={cId}
                  onPress={() => router.push({ pathname: '/career/[id]', params: { id: cId } })}
                  style={({ pressed }) => [
                    styles.careerLink,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View>
                    <Text style={[styles.careerLinkName, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                      {career.name}
                    </Text>
                    <Text style={[styles.careerLinkSalary, { color: domain.color, fontFamily: 'Inter_500Medium' }]}>
                      {career.salary}
                    </Text>
                  </View>
                  <Feather name="arrow-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              );
            })}
          </Section>
        )}

        {/* Recommended Books */}
        {domain.recommendedBooks.length > 0 && (
          <Section title="Recommended Books" colors={colors}>
            {domain.recommendedBooks.map((book, i) => (
              <View key={i} style={[styles.bookCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Feather name="book" size={16} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookTitle, { color: colors.foreground, fontFamily: 'Inter_600SemiBold' }]}>
                    {book.title}
                  </Text>
                  <Text style={[styles.bookAuthor, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    by {book.author}
                  </Text>
                  <Text style={[styles.bookDesc, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                    {book.description}
                  </Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {domain.certifications.length > 0 && (
          <Section title="Certifications" colors={colors}>
            {domain.certifications.map((c, i) => (
              <BulletItem key={i} text={c} color={colors.teal} colors={colors} />
            ))}
          </Section>
        )}
      </ScrollView>
    </>
  );
}

function MetaItem({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Feather name={icon as never} size={13} color="rgba(255,255,255,0.75)" />
      <Text style={[styles.metaValue, { fontFamily: 'Inter_400Regular' }]}>{value}</Text>
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
  color,
  colors,
}: {
  text: string;
  color: string;
  colors: ReturnType<typeof useColors>;
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

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: color + '18', borderColor: color + '44' }]}>
      <Text style={[styles.pillText, { color, fontFamily: 'Inter_500Medium' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16 },

  hero: { paddingHorizontal: 20, paddingBottom: 28, gap: 6 },
  heroName: { color: '#fff', fontSize: 26, lineHeight: 34 },
  heroTagline: { color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 20 },
  heroMeta: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  metaItem: { flex: 1, alignItems: 'center', gap: 4 },
  metaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  metaValue: { color: 'rgba(255,255,255,0.85)', fontSize: 12, textAlign: 'center' },

  section: { paddingHorizontal: 16, paddingTop: 22, gap: 10 },
  sectionTitle: { fontSize: 17, marginBottom: 2 },
  bodyText: { fontSize: 14, lineHeight: 22 },

  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  pillText: { fontSize: 12 },

  bulletRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  bulletDot: { width: 7, height: 7, borderRadius: 4, marginTop: 7 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 21 },

  futureCard: { borderRadius: 10, borderWidth: 1, padding: 14 },

  careerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  careerLinkName: { fontSize: 14, marginBottom: 2 },
  careerLinkSalary: { fontSize: 13 },

  bookCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bookTitle: { fontSize: 14, marginBottom: 1 },
  bookAuthor: { fontSize: 12, marginBottom: 4 },
  bookDesc: { fontSize: 12, lineHeight: 18 },
});
