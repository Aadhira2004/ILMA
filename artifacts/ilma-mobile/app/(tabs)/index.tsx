import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { careers, domains, roadmaps, exams } from '@/data';
import { CareerCard } from '@/components/CareerCard';

const STATS = [
  { label: 'Careers', icon: 'briefcase' as const, route: '/(tabs)/careers' },
  { label: 'Domains', icon: 'grid' as const, route: '/(tabs)/domains' },
  { label: 'Roadmaps', icon: 'map' as const, route: '/(tabs)/roadmaps' },
  { label: 'Exams', icon: 'award' as const, route: '/(tabs)/exams' },
];

const STAT_COUNTS = [careers.length, domains.length, roadmaps.length, exams.length];

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const featuredCareers = careers.slice(0, 5);
  const featuredDomains = domains.slice(0, 6);

  const heroPaddingTop =
    Platform.OS === 'web' ? 67 + 24 : insets.top + 24;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 34 + 32 : 32 }}
    >
      {/* ── Hero ── */}
      <View style={[styles.hero, { backgroundColor: colors.primary, paddingTop: heroPaddingTop }]}>
        <Text style={[styles.heroEyebrow, { fontFamily: 'Inter_500Medium' }]}>ILMA</Text>
        <Text style={[styles.heroTitle, { fontFamily: 'Poppins_700Bold' }]}>
          Biomedical{'\n'}Career Guide
        </Text>
        <Text style={[styles.heroSubtitle, { fontFamily: 'Inter_400Regular' }]}>
          Careers · Domains · Roadmaps · Exams
        </Text>
        {/* decorative circles */}
        <View style={[styles.deco1, { backgroundColor: colors.teal }]} />
        <View style={[styles.deco2, { backgroundColor: colors.teal }]} />
      </View>

      {/* ── Stats grid ── */}
      <View style={[styles.statsWrap, { backgroundColor: colors.background }]}>
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <Pressable
              key={s.label}
              onPress={() => router.push(s.route as Parameters<typeof router.push>[0])}
              style={({ pressed }) => [
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Feather name={s.icon} size={18} color={colors.primary} />
              <Text style={[styles.statCount, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
                {STAT_COUNTS[i]}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Featured Careers ── */}
      <SectionHeader
        title="Featured Careers"
        onSeeAll={() => router.push('/(tabs)/careers')}
        colors={colors}
      />
      <FlatList
        data={featuredCareers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.hList}
        renderItem={({ item }) => (
          <CareerCard
            career={item}
            compact
            onPress={() =>
              router.push({ pathname: '/career/[id]', params: { id: item.id } })
            }
          />
        )}
      />

      {/* ── Explore Domains ── */}
      <SectionHeader
        title="Explore Domains"
        onSeeAll={() => router.push('/(tabs)/domains')}
        colors={colors}
      />
      <View style={styles.domainList}>
        {featuredDomains.map((domain) => (
          <Pressable
            key={domain.id}
            onPress={() =>
              router.push({ pathname: '/domain/[id]', params: { id: domain.id } })
            }
            style={({ pressed }) => [
              styles.domainRow,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.domainBar, { backgroundColor: domain.color }]} />
            <View style={styles.domainInfo}>
              <Text style={[styles.domainName, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
                {domain.name}
              </Text>
              <Text style={[styles.domainTagline, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
                {domain.tagline}
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  onSeeAll,
  colors,
}: {
  title: string;
  onSeeAll: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground, fontFamily: 'Poppins_600SemiBold' }]}>
        {title}
      </Text>
      <Pressable onPress={onSeeAll}>
        <Text style={[styles.seeAll, { color: colors.primary, fontFamily: 'Inter_500Medium' }]}>
          See all
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },

  /* Hero */
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    overflow: 'hidden',
    position: 'relative',
  },
  heroEyebrow: { color: 'rgba(255,255,255,0.6)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  heroTitle: { color: '#fff', fontSize: 34, lineHeight: 42, marginBottom: 8 },
  heroSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 14 },
  deco1: { position: 'absolute', width: 150, height: 150, borderRadius: 75, top: -40, right: -40, opacity: 0.15 },
  deco2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, bottom: 10, right: 60, opacity: 0.2 },

  /* Stats */
  statsWrap: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 3,
  },
  statCount: { fontSize: 20 },
  statLabel: { fontSize: 10 },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 17 },
  seeAll: { fontSize: 14 },

  /* Featured careers horizontal list */
  hList: { paddingHorizontal: 16, paddingRight: 4 },

  /* Domains */
  domainList: { paddingHorizontal: 16 },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
    gap: 12,
  },
  domainBar: { width: 4, alignSelf: 'stretch' },
  domainInfo: { flex: 1, paddingVertical: 12 },
  domainName: { fontSize: 14, marginBottom: 2 },
  domainTagline: { fontSize: 12 },
});
