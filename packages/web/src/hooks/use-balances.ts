import { useQuery } from "@tanstack/react-query";
import type { UserBalance } from "../types";
import { useLoyalOps } from "../context/loyalops-provider";
import { parseUserIdFromToken } from "../utils/shared";

export function useBalances({ currencyIds }: { currencyIds?: string[] } = {}) {
    const { client, config } = useLoyalOps();

    return useQuery<UserBalance[]>({
        queryKey: ["loyalops", "balances", config.userToken, currencyIds ?? null],
        queryFn: () => {
            const userId = parseUserIdFromToken(config.userToken);
            const params = currencyIds?.length ? `?currencyIds=${currencyIds.join(",")}` : "";
            return client.request<UserBalance[]>(`/sdk/users/${userId}/balances${params}`);
        },
    });
}
