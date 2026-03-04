export { createLoyalOps } from "./plugin";
export type { CreateLoyalOpsOptions, LoyalOpsContext } from "./plugin";

export { useLoyalOps } from "./composables/use-loyalops";
export { useMissions } from "./composables/use-missions";
export { useSubmissions, useSubmitMission, useConnectPlatform } from "./composables/use-submissions";
export { useBalances } from "./composables/use-balances";
export { useMultipliers } from "./composables/use-multipliers";
export { useRank } from "./composables/use-rank";
export { useLeaderboard } from "./composables/use-leaderboard";
export type { UseLeaderboardOptions } from "./composables/use-leaderboard";

// Re-export core types for convenience
export type {
    Mission,
    MissionSubmission,
    MissionReward,
    MissionType,
    MissionStatus,
    MissionFrequency,
    SubmissionStatus,
    RewardType,
    CurrencyRewardConfig,
    MultiplierRewardConfig,
    ExternalRewardConfig,
    Currency,
    Platform,
    LoyalOpsConfig,
    UserBalance,
    UserMultiplier,
    UserRank,
    LeaderboardEntry,
    Leaderboard,
} from "@loyalops/web-core";
export { LoyalOpsClient, LoyalOpsApiError } from "@loyalops/web-core";
