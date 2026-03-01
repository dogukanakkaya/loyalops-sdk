import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useBalances } from '@loyalops/react-native';
import type { UserBalance } from '@loyalops/react-native';

function BalanceRow({ balance }: { balance: UserBalance }) {
    const label = balance.currency.symbol ?? balance.currency.name;
    return (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={styles.icon}>
                    <Text style={styles.iconText}>🪙</Text>
                </View>
                <Text style={styles.currencyName}>{balance.currency.name}</Text>
            </View>
            <Text style={styles.amount}>
                {balance.balance.toLocaleString()} {label}
            </Text>
        </View>
    );
}

interface Props {
    currencyIds?: string[];
}

export function BalancesCard({ currencyIds }: Props) {
    const { data: balances, isLoading, error } = useBalances({ currencyIds });

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Balances</Text>
                {isLoading && <ActivityIndicator size="small" color="#94a3b8" />}
            </View>

            <View style={styles.cardBody}>
                {error && <Text style={styles.errorText}>Failed to load balances.</Text>}

                {!isLoading && !error && (!balances || balances.length === 0) && (
                    <Text style={styles.emptyText}>No balances yet.</Text>
                )}

                {balances?.map((b) => <BalanceRow key={b.id} balance={b} />)}
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
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    icon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 14,
    },
    currencyName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
    },
    amount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
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
