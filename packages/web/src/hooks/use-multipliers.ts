import { useQuery } from "@tanstack/react-query";
import type { UserMultiplier } from "../types";
import { useLoyalOps } from "../context/loyalops-provider";
import { parseUserIdFromToken } from "../utils/shared";

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
