import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { MissionSubmission } from "../types";
import { useLoyalOps } from "../context/loyalops-provider";

export function useSubmissions() {
    const { client } = useLoyalOps();

    return useQuery<MissionSubmission[]>({
        queryKey: ["loyalops", "submissions"],
        queryFn: () => client.request<MissionSubmission[]>("/sdk/missions/submissions"),
    });
}

export function useSubmitMission() {
    const { client } = useLoyalOps();
    const queryClient = useQueryClient();

    return useMutation<MissionSubmission, Error, { missionId: string; userData?: Record<string, unknown> }>({
        mutationFn: ({ missionId, userData }) =>
            client.request<MissionSubmission>("/sdk/missions/submissions", {
                method: "POST",
                body: JSON.stringify({ missionId, userData }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["loyalops", "submissions"] });
            queryClient.invalidateQueries({ queryKey: ["loyalops", "missions"] });
        },
    });
}

export function useConnectPlatform({ redirectUrl }: { redirectUrl: string }) {
    const { client } = useLoyalOps();

    return useMutation<void, Error, string>({
        mutationFn: async (platform: string) => {
            const { url } = await client.request<{ url: string }>(
                `/sdk/social/connect/${platform}?redirectUrl=${encodeURIComponent(redirectUrl)}`,
            );
            window.location.href = url;
        },
    });
}
