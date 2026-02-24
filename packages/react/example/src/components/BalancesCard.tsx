import { useBalances } from "@loyalops/react";
import type { UserBalance } from "@loyalops/react";

function BalanceRow({ balance }: { balance: UserBalance }) {
    const label = balance.currency.symbol ?? balance.currency.name;
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-2.5">
                <span className="size-8 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-base">
                    🪙
                </span>
                <span className="text-sm font-medium text-slate-700">
                    {balance.currency.name}
                </span>
            </div>
            <span className="text-sm font-bold text-slate-800 tabular-nums">
                {balance.balance.toLocaleString()} {label}
            </span>
        </div>
    );
}

interface Props {
    /** Optionally filter by specific currency IDs */
    currencyIds?: string[];
}

export function BalancesCard({ currencyIds }: Props) {
    const { data: balances, isLoading, error } = useBalances({ currencyIds });

    return (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Balances</h2>
                {isLoading && (
                    <span className="size-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
                )}
            </div>

            <div className="px-5">
                {error && (
                    <p className="py-4 text-sm text-red-500">
                        Failed to load balances.
                    </p>
                )}

                {!isLoading && !error && (!balances || balances.length === 0) && (
                    <p className="py-4 text-sm text-slate-400">No balances yet.</p>
                )}

                {balances?.map((b) => (
                    <BalanceRow key={b.id} balance={b} />
                ))}
            </div>
        </div>
    );
}
