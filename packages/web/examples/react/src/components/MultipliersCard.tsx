import { useMultipliers } from "@loyalops/web";
import type { UserMultiplier } from "@loyalops/web";

function formatTimeLeft(expiresAt: string | null): string {
    if (!expiresAt) return "Permanent";
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return "Expired";
    const hours = Math.floor(ms / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000) / 60_000);
    if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h left`;
    }
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
}

function MultiplierRow({ multiplier }: { multiplier: UserMultiplier }) {
    const timeLeft = formatTimeLeft(multiplier.expiresAt);
    const expired = multiplier.expiresAt && new Date(multiplier.expiresAt) <= new Date();

    return (
        <div className={[
            "flex items-center justify-between py-3 border-b border-slate-100 last:border-0",
            expired ? "opacity-45" : "",
        ].join(" ")}>
            <div className="flex items-center gap-2.5">
                <span className="size-8 flex items-center justify-center rounded-full bg-violet-50 border border-violet-200 text-base">
                    ⚡
                </span>
                <div>
                    <span className="text-sm font-medium text-slate-700">Multiplier</span>
                    <p className="text-xs text-slate-400 mt-0.5">{timeLeft}</p>
                </div>
            </div>
            <span className="text-sm font-bold text-violet-600 tabular-nums">
                {multiplier.value}×
            </span>
        </div>
    );
}

export function MultipliersCard() {
    const { data: multipliers, isLoading, error } = useMultipliers();

    const active = multipliers?.filter(
        (m) => !m.expiresAt || new Date(m.expiresAt) > new Date(),
    );

    const effectiveMultiplier = active?.reduce((acc, m) => acc * m.value, 1) ?? 1;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Multipliers</h2>
                <div className="flex items-center gap-2">
                    {isLoading && (
                        <span className="size-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
                    )}
                    {!isLoading && effectiveMultiplier > 1 && (
                        <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                            {effectiveMultiplier}× active
                        </span>
                    )}
                </div>
            </div>

            <div className="px-5">
                {error && (
                    <p className="py-4 text-sm text-red-500">
                        Failed to load multipliers.
                    </p>
                )}

                {!isLoading && !error && (!multipliers || multipliers.length === 0) && (
                    <p className="py-4 text-sm text-slate-400">No active multipliers.</p>
                )}

                {multipliers?.map((m) => (
                    <MultiplierRow key={m.id} multiplier={m} />
                ))}
            </div>
        </div>
    );
}
