import { useQuery } from "@tanstack/vue-query";
import type { Mission } from "@loyalops/web-core";
import { useLoyalOps } from "./use-loyalops";

export function useMissions() {
    const { client } = useLoyalOps();

    return useQuery<Mission[]>({
        queryKey: ["loyalops", "missions"],
        queryFn: () => client.request<Mission[]>("/sdk/missions"),
    });
}
