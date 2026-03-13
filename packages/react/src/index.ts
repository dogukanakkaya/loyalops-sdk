export { LoyalOpsProvider } from "./context/loyalops-provider";
export type { LoyalOpsProviderProps } from "./context/loyalops-provider";
export { useLoyalOps } from "./context/loyalops-provider";

export { useMissions } from "./hooks/use-missions";
export { useSubmissions, useSubmitMission, useConnectPlatform } from "./hooks/use-submissions";
export { useBalances } from "./hooks/use-balances";
export { useMultipliers } from "./hooks/use-multipliers";
export { useRank } from "./hooks/use-rank";
export { useLeaderboard } from "./hooks/use-leaderboard";
export type { UseLeaderboardOptions } from "./hooks/use-leaderboard";
export { useNonce } from "./hooks/use-nonce";

// Re-export everything from core for convenience
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
    NonceResponse,
} from "@loyalops/web-core";
export { LoyalOpsClient, LoyalOpsApiError } from "@loyalops/web-core";