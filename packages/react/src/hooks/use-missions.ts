import { useQuery } from "@tanstack/react-query";
import type { Mission } from "@loyalops/web-core";
import { useLoyalOps } from "../context/loyalops-provider";

export function useMissions() {
    const { client } = useLoyalOps();

    return useQuery<Mission[]>({
        queryKey: ["loyalops", "missions"],
        queryFn: () => client.request<Mission[]>("/sdk/missions"),
    });
}