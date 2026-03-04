import { useQuery } from "@tanstack/react-query";
import type { UserRank } from "@loyalops/web-core";
import { parseUserIdFromToken } from "@loyalops/web-core";
import { useLoyalOps } from "../context/loyalops-provider";

export function useRank({ currencyIds }: { currencyIds?: string[] } = {}) {
    const { client, config } = useLoyalOps();

    return useQuery<UserRank[]>({
        queryKey: ["loyalops", "rank", config.userToken, currencyIds ?? null],
        queryFn: () => {
            const userId = parseUserIdFromToken(config.userToken);
            const params = currencyIds?.length ? `?currencyIds=${currencyIds.join(",")}` : "";
            return client.request<UserRank[]>(`/sdk/users/${userId}/rank${params}`);
        },
    });
}
