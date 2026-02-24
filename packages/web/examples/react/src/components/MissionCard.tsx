import type { Mission, MissionSubmission, MissionFrequency } from "@loyalops/web";
import { MISSION_TYPE_ICONS } from "../utils/mission-icons";

const FREQUENCY_LABELS: Record<MissionFrequency, string> = {
    once: "One-time",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
};

interface Props {
    mission: Mission;
    submission?: MissionSubmission;
    onClick: () => void;
}

export function MissionCard({ mission, submission, onClick }: Props) {
    const isCompleted = submission?.status === "approved";
    const isPending = submission?.status === "pending";

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "group w-full text-left rounded-2xl border bg-white transition-all duration-200 cursor-pointer overflow-hidden",
                isCompleted
                    ? "border-slate-200 opacity-70"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.18)]",
            ].join(" ")}
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={[
                        "flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm [&>svg]:size-6",
                        isCompleted ? "bg-slate-100" : "bg-white border border-slate-200 group-hover:border-indigo-200",
                    ].join(" ")}>
                        {MISSION_TYPE_ICONS[mission.type]}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className={[
                                "font-semibold leading-snug",
                                isCompleted ? "text-slate-400 line-through" : "text-slate-800",
                            ].join(" ")}>
                                {mission.name}
                            </h3>
                            {isCompleted && (
                                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                    <span>✓</span> Done
                                </span>
                            )}
                            {isPending && (
                                <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                    <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    Review
                                </span>
                            )}
                        </div>

                        {mission.description && (
                            <p className="mt-1 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                {mission.description}
                            </p>
                        )}

                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                            {/* Frequency */}
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <span>🔁</span>
                                {FREQUENCY_LABELS[mission.frequency] ?? mission.frequency}
                            </span>

                            {/* Rewards */}
                            {mission.rewards?.map((r) => {
                                if (r.type === "currency" && r.currency) {
                                    const amount = (r.config as { amount: number })?.amount;
                                    return (
                                        <span key={r.id} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                            🪙 {amount} {r.currency.symbol ?? r.currency.name}
                                        </span>
                                    );
                                }
                                if (r.type === "multiplier") {
                                    const cfg = r.config as { value: number } | null;
                                    return (
                                        <span key={r.id} className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                                            ⚡ {cfg?.value}x
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>

                    {/* Arrow */}
                    {!isCompleted && (
                        <span className="shrink-0 self-center text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all text-sm">
                            →
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}
