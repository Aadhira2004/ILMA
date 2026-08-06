import React from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { domains } from '@/data';
import { DomainCard } from '@/components/DomainCard';

export default function DomainsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const headerTop = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
            paddingTop: headerTop + 12,
          },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground, fontFamily: 'Poppins_700Bold' }]}>
          Domains
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          {domains.length} biomedical specializations
        </Text>
      </View>

      <FlatList
        data={domains}
        keyExtractor={(d) => d.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: Platform.OS === 'web' ? 34 + 20 : 20 },
        ]}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <DomainCard
            domain={item}
            onPress={() =>
              router.push({ pathname: '/domain/[id]', params: { id: item.id } })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 4,
  },
  screenTitle: { fontSize: 26 },
  subtitle: { fontSize: 14 },
  grid: { padding: 12 },
  row: { gap: 10, marginBottom: 10 },
});
