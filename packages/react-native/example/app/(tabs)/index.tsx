import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BalancesCard } from '@/components/loyalops/BalancesCard';
import { MultipliersCard } from '@/components/loyalops/MultipliersCard';
import { MissionList } from '@/components/loyalops/MissionList';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLogo}>
          <Text style={styles.headerLogoText}>L</Text>
        </View>
        <Text style={styles.headerTitle}>LoyalOps</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>SDK Demo</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Missions section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missions</Text>
          <Text style={styles.sectionSubtitle}>
            Complete missions to earn rewards and level up your loyalty.
          </Text>
          <MissionList />
        </View>

        {/* Wallet section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Wallet</Text>
          <BalancesCard />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Multipliers</Text>
          <MultipliersCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  headerBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  headerBadgeText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
});
