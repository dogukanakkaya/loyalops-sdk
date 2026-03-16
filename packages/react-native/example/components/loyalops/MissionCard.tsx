import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Mission, MissionSubmission, MissionFrequency } from '@loyalops/react-native';
import { getMissionTypeIcon } from '@/utils/mission-helpers';

const FREQUENCY_LABELS: Record<MissionFrequency, string> = {
    once: 'One-time',
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
};

interface Props {
    mission: Mission;
    submission?: MissionSubmission;
    onClick: () => void;
}

export function MissionCard({ mission, submission, onClick }: Props) {
    const isCompleted = submission?.status === 'approved';
    const isPending = submission?.status === 'pending';

    return (
        <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.75}
            style={[styles.card, isCompleted && styles.cardCompleted]}
        >
            <View style={styles.row}>
                {/* Icon */}
                <View style={[styles.iconBox, isCompleted && styles.iconBoxCompleted]}>
                    <Text style={styles.iconText}>{getMissionTypeIcon(mission.type)}</Text>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text
                            style={[styles.title, isCompleted && styles.titleCompleted]}
                            numberOfLines={1}
                        >
                            {mission.name}
                        </Text>
                        {isCompleted && (
                            <View style={styles.doneBadge}>
                                <Text style={styles.doneBadgeText}>✓ Done</Text>
                            </View>
                        )}
                        {isPending && (
                            <View style={styles.pendingBadge}>
                                <Text style={styles.pendingBadgeText}>Review</Text>
                            </View>
                        )}
                    </View>

                    {mission.description ? (
                        <Text style={styles.description} numberOfLines={2}>
                            {mission.description}
                        </Text>
                    ) : null}

                    <View style={styles.meta}>
                        <Text style={styles.frequency}>
                            🔁 {FREQUENCY_LABELS[mission.frequency] ?? mission.frequency}
                        </Text>

                        {mission.rewards?.map((r) => {
                            if (r.type === 'currency' && r.currency) {
                                const value = (r.config as { value: number })?.value;
                                return (
                                    <View key={r.id} style={styles.rewardPill}>
                                        <Text style={styles.rewardPillText}>
                                            🪙 {value} {r.currency.symbol ?? r.currency.name}
                                        </Text>
                                    </View>
                                );
                            }
                            if (r.type === 'multiplier') {
                                const cfg = r.config as { value: number } | null;
                                return (
                                    <View key={r.id} style={styles.multiplierPill}>
                                        <Text style={styles.multiplierPillText}>⚡ {cfg?.value}x</Text>
                                    </View>
                                );
                            }
                            return null;
                        })}
                    </View>
                </View>

                {!isCompleted && <Text style={styles.arrow}>›</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
        padding: 16,
    },
    cardCompleted: {
        opacity: 0.7,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconBoxCompleted: {
        backgroundColor: '#f1f5f9',
        borderColor: '#e2e8f0',
    },
    iconText: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        lineHeight: 20,
    },
    titleCompleted: {
        color: '#94a3b8',
        textDecorationLine: 'line-through',
    },
    doneBadge: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    doneBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#059669',
    },
    pendingBadge: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    pendingBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#d97706',
    },
    description: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    frequency: {
        fontSize: 12,
        color: '#94a3b8',
    },
    rewardPill: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    rewardPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#d97706',
    },
    multiplierPill: {
        backgroundColor: '#f5f3ff',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 99,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    multiplierPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#7c3aed',
    },
    arrow: {
        fontSize: 20,
        color: '#cbd5e1',
        alignSelf: 'center',
    },
});
