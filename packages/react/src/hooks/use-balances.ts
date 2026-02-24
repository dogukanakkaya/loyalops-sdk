import { useQuery } from "@tanstack/react-query";
import type { UserBalance } from "@loyalops/web-core";
import { parseUserIdFromToken } from "@loyalops/web-core";
import { useLoyalOps } from "../context/loyalops-provider";

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
