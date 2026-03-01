import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Linking,
    ActivityIndicator,
} from 'react-native';
import type { Mission, MissionSubmission } from '@loyalops/react-native';
import {
    useMissions,
    useSubmissions,
    useSubmitMission,
    useConnectPlatform,
} from '@loyalops/react-native';
import { MissionCard } from './MissionCard';
import { getMissionActionUrl, getMissionActionLabel, getMissionTypeIcon } from '@/utils/mission-helpers';
import { REDIRECT_URL } from '@/constants/config';

const CONNECT_PLATFORM_TYPES = new Set([
    'connect_x',
    'connect_google',
    'connect_discord',
    'connect_telegram',
    'connect_twitch',
]);

// ── Mission Modal ──────────────────────────────────────────────────────────────

function MissionModal({
    mission,
    submission,
    onClose,
}: {
    mission: Mission;
    submission?: MissionSubmission;
    onClose: () => void;
}) {
    const submitMutation = useSubmitMission();
    const connectMutation = useConnectPlatform({ redirectUrl: REDIRECT_URL });
    const [showSuccess, setShowSuccess] = useState(false);

    const isCompleted = submission?.status === 'approved';
    const isPending = submission?.status === 'pending';
    const isConnect = CONNECT_PLATFORM_TYPES.has(mission.type);
    const actionUrl = getMissionActionUrl(mission.type, mission.config);
    const actionLabel = getMissionActionLabel(mission.type);
    const error = submitMutation.error ?? connectMutation.error;

    const handleSubmit = async () => {
        try {
            await submitMutation.mutateAsync({ missionId: mission.id });
            setShowSuccess(true);
            setTimeout(onClose, 1200);
        } catch { /* error shown below */ }
    };

    const handleConnect = async () => {
        const platform = mission.type.replace('connect_', '');
        await connectMutation.mutateAsync(platform);
    };

    const handleOpenLink = () => {
        if (actionUrl) Linking.openURL(actionUrl);
    };

    return (
        <View style={modal.container}>
            {/* Header */}
            <View style={modal.header}>
                <View style={modal.headerLeft}>
                    <View style={modal.iconBox}>
                        <Text style={modal.iconText}>{getMissionTypeIcon(mission.type)}</Text>
                    </View>
                    <View>
                        <Text style={modal.title}>{mission.name}</Text>
                        <Text style={modal.subtitle}>{mission.type.replace(/_/g, ' ')}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={modal.closeBtn} hitSlop={8}>
                    <Text style={modal.closeBtnText}>✕</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={modal.body} showsVerticalScrollIndicator={false}>
                {/* Description */}
                {mission.description ? (
                    <Text style={modal.description}>{mission.description}</Text>
                ) : null}

                {/* Connect button */}
                {isConnect && (
                    <TouchableOpacity
                        style={[modal.actionBtn, connectMutation.isPending && modal.btnDisabled]}
                        onPress={handleConnect}
                        disabled={connectMutation.isPending || isCompleted}
                        activeOpacity={0.8}
                    >
                        {connectMutation.isPending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={modal.actionBtnText}>
                                Connect {mission.type.replace('connect_', '').charAt(0).toUpperCase() + mission.type.replace('connect_', '').slice(1)}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Action link */}
                {!isConnect && actionUrl && (
                    <TouchableOpacity
                        style={modal.linkBtn}
                        onPress={handleOpenLink}
                        activeOpacity={0.8}
                    >
                        <Text style={modal.linkBtnText}>↗ {actionLabel ?? 'Open link'}</Text>
                    </TouchableOpacity>
                )}

                {/* Rewards */}
                {mission.rewards && mission.rewards.length > 0 && (
                    <View style={modal.rewardsBox}>
                        <Text style={modal.rewardsLabel}>Rewards</Text>
                        <View style={modal.rewardsRow}>
                            {mission.rewards.map((r) => {
                                if (r.type === 'currency' && r.currency) {
                                    const amount = (r.config as { amount: number })?.amount;
                                    return (
                                        <View key={r.id} style={modal.rewardPill}>
                                            <Text style={modal.rewardPillText}>
                                                🪙 {amount} {r.currency.symbol ?? r.currency.name}
                                            </Text>
                                        </View>
                                    );
                                }
                                if (r.type === 'multiplier') {
                                    const cfg = r.config as { value: number } | null;
                                    return (
                                        <View key={r.id} style={modal.multiplierPill}>
                                            <Text style={modal.multiplierPillText}>⚡ {cfg?.value}× multiplier</Text>
                                        </View>
                                    );
                                }
                                if (r.type === 'external') {
                                    const cfg = r.config as { description?: string } | null;
                                    return (
                                        <View key={r.id} style={modal.externalPill}>
                                            <Text style={modal.externalPillText}>
                                                🎁 {cfg?.description ?? 'External reward'}
                                            </Text>
                                        </View>
                                    );
                                }
                                return null;
                            })}
                        </View>
                    </View>
                )}

                {/* Error */}
                {error && (
                    <View style={modal.errorBox}>
                        <Text style={modal.errorText}>⚠ {(error as Error).message ?? 'Something went wrong.'}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View style={modal.footer}>
                {showSuccess && (
                    <View style={modal.successBanner}>
                        <Text style={modal.successBannerText}>✓ Submitted!</Text>
                    </View>
                )}
                {!showSuccess && isCompleted && (
                    <View style={modal.successBanner}>
                        <Text style={modal.successBannerText}>✓ Completed</Text>
                    </View>
                )}
                {!showSuccess && isPending && (
                    <View style={modal.pendingBanner}>
                        <Text style={modal.pendingBannerText}>Under review</Text>
                    </View>
                )}
                {!isCompleted && !showSuccess && (
                    <TouchableOpacity
                        style={[modal.submitBtn, submitMutation.isPending && modal.btnDisabled]}
                        onPress={handleSubmit}
                        disabled={submitMutation.isPending}
                        activeOpacity={0.8}
                    >
                        {submitMutation.isPending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={modal.submitBtnText}>Mark as complete</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// ── MissionList ────────────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <View style={list.skeleton}>
            <View style={list.skeletonIcon} />
            <View style={list.skeletonContent}>
                <View style={list.skeletonLine1} />
                <View style={list.skeletonLine2} />
                <View style={list.skeletonLine3} />
            </View>
        </View>
    );
}

export function MissionList() {
    const [selected, setSelected] = useState<Mission | null>(null);
    const { data: missions, isLoading: loadingMissions, error: missionsError } = useMissions();
    const { data: submissions, isLoading: loadingSubmissions } = useSubmissions();

    const isLoading = loadingMissions || loadingSubmissions;

    const submissionByMission = (id: string) => submissions?.find((s) => s.missionId === id);

    const available = missions?.filter((m) => submissionByMission(m.id)?.status !== 'approved') ?? [];
    const completed = missions?.filter((m) => submissionByMission(m.id)?.status === 'approved') ?? [];

    if (missionsError) {
        return (
            <View style={list.errorState}>
                <Text style={list.errorEmoji}>⚠️</Text>
                <Text style={list.errorTitle}>Failed to load missions</Text>
                <Text style={list.errorMsg}>{(missionsError as Error).message}</Text>
            </View>
        );
    }

    return (
        <>
            {/* Progress bar */}
            {!isLoading && missions && missions.length > 0 && (
                <View style={list.progress}>
                    <View style={list.progressMeta}>
                        <Text style={list.progressLabel}>Progress</Text>
                        <Text style={list.progressCount}>{completed.length} / {missions.length} completed</Text>
                    </View>
                    <View style={list.progressTrack}>
                        <View
                            style={[
                                list.progressFill,
                                { width: `${missions.length ? (completed.length / missions.length) * 100 : 0}%` as any },
                            ]}
                        />
                    </View>
                </View>
            )}

            {/* Loading */}
            {isLoading && (
                <View style={list.skeletons}>
                    {[0, 1, 2, 3].map((i) => <Skeleton key={i} />)}
                </View>
            )}

            {/* Empty */}
            {!isLoading && missions?.length === 0 && (
                <View style={list.emptyState}>
                    <View style={list.emptyIcon}><Text style={list.emptyIconText}>🎯</Text></View>
                    <Text style={list.emptyTitle}>No missions available</Text>
                    <Text style={list.emptyMsg}>Check back later for new challenges.</Text>
                </View>
            )}

            {/* Available */}
            {!isLoading && available.length > 0 && (
                <View style={list.cards}>
                    {available.map((m) => (
                        <MissionCard
                            key={m.id}
                            mission={m}
                            submission={submissionByMission(m.id)}
                            onClick={() => setSelected(m)}
                        />
                    ))}
                </View>
            )}

            {/* Completed */}
            {!isLoading && completed.length > 0 && (
                <View style={list.completedSection}>
                    <Text style={list.completedLabel}>Completed</Text>
                    <View style={list.cards}>
                        {completed.map((m) => (
                            <MissionCard
                                key={m.id}
                                mission={m}
                                submission={submissionByMission(m.id)}
                                onClick={() => setSelected(m)}
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* Modal */}
            <Modal
                visible={!!selected}
                transparent
                animationType="slide"
                onRequestClose={() => setSelected(null)}
            >
                <TouchableWithoutFeedback onPress={() => setSelected(null)}>
                    <View style={modal.overlay}>
                        <TouchableWithoutFeedback>
                            <View style={modal.sheet}>
                                {selected && (
                                    <MissionModal
                                        mission={selected}
                                        submission={submissionByMission(selected.id)}
                                        onClose={() => setSelected(null)}
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const list = StyleSheet.create({
    progress: { marginBottom: 20 },
    progressMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: { fontSize: 13, fontWeight: '500', color: '#475569' },
    progressCount: { fontSize: 13, color: '#94a3b8' },
    progressTrack: {
        height: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 99,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#6366f1',
        borderRadius: 99,
    },
    skeletons: { gap: 10 },
    skeleton: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#f1f5f9',
        backgroundColor: '#fff',
    },
    skeletonIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f1f5f9' },
    skeletonContent: { flex: 1, gap: 8, justifyContent: 'center' },
    skeletonLine1: { height: 12, backgroundColor: '#f1f5f9', borderRadius: 99, width: '40%' },
    skeletonLine2: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 99, width: '80%' },
    skeletonLine3: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 99, width: '25%' },
    errorState: { alignItems: 'center', paddingVertical: 48 },
    errorEmoji: { fontSize: 36, marginBottom: 10 },
    errorTitle: { fontSize: 15, fontWeight: '600', color: '#475569' },
    errorMsg: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
    cards: { gap: 10 },
    completedSection: { marginTop: 24, gap: 10 },
    completedLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptyState: { alignItems: 'center', paddingVertical: 48 },
    emptyIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyIconText: { fontSize: 24 },
    emptyTitle: { fontSize: 15, fontWeight: '600', color: '#475569' },
    emptyMsg: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});

const modal = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f1f5f9',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: { fontSize: 18 },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        lineHeight: 20,
    },
    subtitle: {
        fontSize: 11,
        color: '#94a3b8',
        marginTop: 1,
        textTransform: 'capitalize',
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: { fontSize: 13, color: '#64748b' },
    body: { paddingHorizontal: 20, paddingTop: 16 },
    description: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 16,
    },
    actionBtn: {
        backgroundColor: '#6366f1',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    linkBtn: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    linkBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    rewardsBox: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    rewardsLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    rewardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    rewardPill: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    rewardPillText: { fontSize: 12, fontWeight: '600', color: '#b45309' },
    multiplierPill: {
        backgroundColor: '#f5f3ff',
        borderWidth: 1,
        borderColor: '#ddd6fe',
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    multiplierPillText: { fontSize: 12, fontWeight: '600', color: '#7c3aed' },
    externalPill: {
        backgroundColor: '#eff6ff',
        borderWidth: 1,
        borderColor: '#bfdbfe',
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    externalPillText: { fontSize: 12, fontWeight: '600', color: '#1d4ed8' },
    errorBox: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fecaca',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    errorText: { fontSize: 13, color: '#dc2626' },
    footer: {
        padding: 20,
        paddingBottom: 32,
        gap: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#f1f5f9',
    },
    submitBtn: {
        backgroundColor: '#6366f1',
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: 'center',
    },
    submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    btnDisabled: { opacity: 0.5 },
    successBanner: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#a7f3d0',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    successBannerText: { fontSize: 14, fontWeight: '600', color: '#059669' },
    pendingBanner: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    pendingBannerText: { fontSize: 14, fontWeight: '600', color: '#d97706' },
});
