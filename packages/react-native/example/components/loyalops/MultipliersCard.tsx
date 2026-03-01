import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useMultipliers } from '@loyalops/react-native';
import type { UserMultiplier } from '@loyalops/react-native';

function formatTimeLeft(expiresAt: string | null): string {
    if (!expiresAt) return 'Permanent';
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return 'Expired';
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}

function MultiplierRow({ multiplier }: { multiplier: UserMultiplier }) {
    const expired = multiplier.expiresAt && new Date(multiplier.expiresAt) <= new Date();
    return (
        <View style={[styles.row, expired ? styles.rowExpired : null]}>
            <View style={styles.rowLeft}>
                <View style={styles.icon}>
                    <Text style={styles.iconText}>⚡</Text>
                </View>
                <View>
                    <Text style={styles.rowLabel}>Multiplier</Text>
                    <Text style={styles.rowSub}>{formatTimeLeft(multiplier.expiresAt)}</Text>
                </View>
            </View>
            <Text style={styles.value}>{multiplier.value}×</Text>
        </View>
    );
}

export function MultipliersCard() {
    const { data: multipliers, isLoading, error } = useMultipliers();

    const active = multipliers?.filter(
        (m) => !m.expiresAt || new Date(m.expiresAt) > new Date(),
    );
    const effectiveMultiplier = active?.reduce((acc, m) => acc * m.value, 1) ?? 1;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Multipliers</Text>
                <View style={styles.headerRight}>
                    {isLoading && <ActivityIndicator size="small" color="#94a3b8" />}
                    {!isLoading && effectiveMultiplier > 1 && (
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>{effectiveMultiplier}× active</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.cardBody}>
                {error && <Text style={styles.errorText}>Failed to load multipliers.</Text>}

                {!isLoading && !error && (!multipliers || multipliers.length === 0) && (
                    <Text style={styles.emptyText}>No active multipliers.</Text>
                )}

                {multipliers?.map((m) => <MultiplierRow key={m.id} multiplier={m} />)}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f1f5f9',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    activeBadge: {
        backgroundColor: '#f5f3ff',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    activeBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#7c3aed',
    },
    cardBody: {
        paddingHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f1f5f9',
    },
    rowExpired: {
        opacity: 0.45,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f3ff',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 14,
    },
    rowLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
    },
    rowSub: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 1,
    },
    value: {
        fontSize: 14,
        fontWeight: '700',
        color: '#7c3aed',
    },
    errorText: {
        fontSize: 13,
        color: '#ef4444',
        paddingVertical: 14,
    },
    emptyText: {
        fontSize: 13,
        color: '#94a3b8',
        paddingVertical: 14,
    },
});
