import { useQuery } from "@tanstack/vue-query";
import type { UserMultiplier } from "@loyalops/web-core";
import { parseUserIdFromToken } from "@loyalops/web-core";
import { useLoyalOps } from "./use-loyalops";

export function useMultipliers() {
    const { client, config } = useLoyalOps();

    return useQuery<UserMultiplier[]>({
        queryKey: ["loyalops", "multipliers", config.userToken],
        queryFn: () => {
            const userId = parseUserIdFromToken(config.userToken);
            return client.request<UserMultiplier[]>(`/sdk/users/${userId}/multipliers`);
        },
    });
}
