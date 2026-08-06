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
import { exams } from '@/data';
import { ExamCard } from '@/components/ExamCard';

export default function ExamsScreen() {
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
          Govt Exams
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: 'Inter_400Regular' }]}>
          GATE, DRDO, ISRO and more
        </Text>
      </View>

      <FlatList
        data={exams}
        keyExtractor={(e) => e.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 34 + 20 : 20 },
        ]}
        renderItem={({ item }) => (
          <ExamCard
            exam={item}
            onPress={() =>
              router.push({ pathname: '/exam/[id]', params: { id: item.id } })
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
  list: { padding: 16, paddingTop: 12 },
});
