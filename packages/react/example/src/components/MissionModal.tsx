import { useEffect, useRef, useState } from "react";
import type { Mission, MissionSubmission } from "@loyalops/react";
import {
    useSubmitMission,
    useConnectPlatform,
} from "@loyalops/react";
import { getMissionActionUrl, getMissionActionLabel } from "../utils/mission-helpers";
import { MISSION_TYPE_ICONS, CONNECT_BUTTON_CLASS } from "../utils/mission-icons";
import { REDIRECT_URL } from "../config";

const CONNECT_PLATFORM_TYPES = new Set([
    "connect_x",
    "connect_google",
    "connect_discord",
    "connect_telegram",
    "connect_twitch",
]);

interface Props {
    mission: Mission;
    submission?: MissionSubmission;
    onClose: () => void;
}

export function MissionModal({ mission, submission, onClose }: Props) {
    const submitMutation = useSubmitMission();
    const connectMutation = useConnectPlatform({ redirectUrl: REDIRECT_URL });
    const [showSuccess, setShowSuccess] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const isCompleted = submission?.status === "approved";
    const isPending = submission?.status === "pending";
    const isConnect = CONNECT_PLATFORM_TYPES.has(mission.type);
    const actionUrl = getMissionActionUrl(mission.type, mission.config);
    const actionLabel = getMissionActionLabel(mission.type);
    const buttonClass = CONNECT_BUTTON_CLASS[mission.type];

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleSubmit = async () => {
        try {
            await submitMutation.mutateAsync({ missionId: mission.id });
            setShowSuccess(true);
            setTimeout(onClose, 1200);
        } catch { /* error shown below */ }
    };

    const handleConnect = async () => {
        const platform = mission.type.replace("connect_", "");
        await connectMutation.mutateAsync(platform);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    const error = submitMutation.error ?? connectMutation.error;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
        >
            <div className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in">
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3.5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 [&>svg]:size-5.5">
                            {MISSION_TYPE_ICONS[mission.type]}
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-800 leading-tight">{mission.name}</h2>
                            <p className="text-xs text-slate-400 mt-0.5 capitalize">{mission.type.replace(/_/g, " ")}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    {/* Description */}
                    {mission.description && (
                        <p className="text-sm text-slate-500 leading-relaxed">{mission.description}</p>
                    )}

                    {/* Connect platform button */}
                    {isConnect && (
                        <div className="space-y-1.5">
                            -                            <button
                                type="button"
                                onClick={handleConnect}
                                disabled={connectMutation.isPending || isCompleted}
                                className={[
                                    "w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                                    "disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:size-4.5",
                                    buttonClass ?? "bg-indigo-500 hover:bg-indigo-600 text-white",
                                ].join(" ")}
                            >
                                {connectMutation.isPending ? (
                                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                                ) : (
                                    MISSION_TYPE_ICONS[mission.type]
                                )}
                                {connectMutation.isPending ? "Redirecting…" : `Connect ${mission.type.replace("connect_", "").charAt(0).toUpperCase() + mission.type.replace("connect_", "").slice(1)}`}
                            </button>
                        </div>
                    )}

                    {/* Action link */}
                    {!isConnect && actionUrl && (
                        <div className="space-y-1.5">
                            <a
                                href={actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-all"
                            >
                                <span>[↗]</span>
                                {actionLabel ?? "Open link"}
                            </a>
                        </div>
                    )}

                    {/* Rewards */}
                    {mission.rewards && mission.rewards.length > 0 && (
                        <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2.5">Rewards</p>
                            <div className="flex flex-wrap gap-2">
                                {mission.rewards.map((r) => {
                                    if (r.type === "currency" && r.currency) {
                                        const amount = (r.config as { amount: number })?.amount;
                                        return (
                                            <div key={r.id} className="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                                                <span>🪙</span>
                                                <span>{amount} {r.currency.symbol ?? r.currency.name}</span>
                                            </div>
                                        );
                                    }
                                    if (r.type === "multiplier") {
                                        const cfg = r.config as { value: number } | null;
                                        return (
                                            <div key={r.id} className="flex items-center gap-1.5 text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
                                                <span>⚡</span>
                                                <span>{cfg?.value}× multiplier</span>
                                            </div>
                                        );
                                    }
                                    if (r.type === "external") {
                                        const cfg = r.config as { description?: string } | null;
                                        return (
                                            <div key={r.id} className="flex items-center gap-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full">
                                                <span>🎁</span>
                                                <span>{cfg?.description ?? "External reward"}</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
                            <span className="shrink-0">⚠</span>
                            <span>{(error as Error).message ?? "Something went wrong."}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    {showSuccess ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <span>✓</span> Submitted!
                        </div>
                    ) : isCompleted ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <span>✓</span> Completed
                        </div>
                    ) : isPending ? (
                        <div className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl">
                            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Under review
                        </div>
                    ) : null}
                    {!isCompleted && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitMutation.isPending}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitMutation.isPending ? (
                                <>
                                    <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Submitting…
                                </>
                            ) : "Mark as complete"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
