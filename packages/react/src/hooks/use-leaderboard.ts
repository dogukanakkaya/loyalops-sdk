import { useQuery } from "@tanstack/react-query";
import type { Leaderboard } from "@loyalops/web-core";
import { useLoyalOps } from "../context/loyalops-provider";

export interface UseLeaderboardOptions {
    currencyIds?: string[];
    skip?: number;
    limit?: number;
}

export function useLeaderboard({ currencyIds, skip, limit }: UseLeaderboardOptions = {}) {
    const { client, config } = useLoyalOps();

    return useQuery<Leaderboard>({
        queryKey: ["loyalops", "leaderboard", config.userToken, currencyIds ?? null, skip ?? null, limit ?? null],
        queryFn: () => {
            const searchParams = new URLSearchParams();
            if (currencyIds?.length) searchParams.set("currencyIds", currencyIds.join(","));
            if (skip !== undefined) searchParams.set("skip", String(skip));
            if (limit !== undefined) searchParams.set("limit", String(limit));
            const qs = searchParams.toString();
            return client.request<Leaderboard>(`/sdk/users/leaderboard${qs ? `?${qs}` : ""}`);
        },
    });
}
