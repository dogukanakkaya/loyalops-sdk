import { useState } from "react";
import type { Mission } from "@loyalops/react";
import { useMissions, useSubmissions } from "@loyalops/react";
import { MissionCard } from "./MissionCard";
import { MissionModal } from "./MissionModal";

function Skeleton() {
    return (
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="size-11 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-slate-100 rounded-full w-2/5" />
                    <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/4" />
                </div>
            </div>
        </div>
    );
}

export function MissionList() {
    const [selected, setSelected] = useState<Mission | null>(null);
    const { data: missions, isLoading: loadingMissions, error: missionsError } = useMissions();
    const { data: submissions, isLoading: loadingSubmissions } = useSubmissions();

    const isLoading = loadingMissions || loadingSubmissions;

    const submissionByMission = (missionId: string) =>
        submissions?.find((s) => s.missionId === missionId);

    const available = missions?.filter((m) => submissionByMission(m.id)?.status !== "approved") ?? [];
    const completed = missions?.filter((m) => submissionByMission(m.id)?.status === "approved") ?? [];

    if (missionsError) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="text-4xl">⚠️</div>
                <p className="text-slate-600 font-medium">Failed to load missions</p>
                <p className="text-sm text-slate-400">{(missionsError as Error).message}</p>
            </div>
        );
    }

    return (
        <>
            {/* Progress bar */}
            {!isLoading && missions && missions.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Progress</span>
                        <span className="text-sm text-slate-400">
                            {completed.length} / {missions.length} completed
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${missions.length ? (completed.length / missions.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && missions?.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                    <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">🎯</div>
                    <p className="text-slate-600 font-medium">No missions available</p>
                    <p className="text-sm text-slate-400">Check back later for new challenges.</p>
                </div>
            )}

            {/* Available missions */}
            {!isLoading && available.length > 0 && (
                <div className="space-y-3">
                    {available.map((m) => (
                        <MissionCard
                            key={m.id}
                            mission={m}
                            submission={submissionByMission(m.id)}
                            onClick={() => setSelected(m)}
                        />
                    ))}
                </div>
            )}

            {/* Completed missions */}
            {!isLoading && completed.length > 0 && (
                <div className="mt-8 space-y-3">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Completed</h2>
                    {completed.map((m) => (
                        <MissionCard
                            key={m.id}
                            mission={m}
                            submission={submissionByMission(m.id)}
                            onClick={() => setSelected(m)}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {selected && (
                <MissionModal
                    mission={selected}
                    submission={submissionByMission(selected.id)}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    );
}
