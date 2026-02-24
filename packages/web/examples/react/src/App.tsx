import { LoyalOpsProvider } from "@loyalops/web";
import { TENANT_PUBLIC_KEY, USER_TOKEN, API_BASE_URL } from "./config";
import { MissionList } from "./components/MissionList";
import { BalancesCard } from "./components/BalancesCard";
import { MultipliersCard } from "./components/MultipliersCard";

export default function App() {
    return (
        <LoyalOpsProvider
            tenantPublicKey={TENANT_PUBLIC_KEY}
            userToken={USER_TOKEN}
            baseUrl={API_BASE_URL}
        >
            <div className="min-h-screen bg-slate-50 antialiased">
                {/* Top bar */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="size-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                                <span className="text-xs font-bold text-white">L</span>
                            </div>
                            <span className="font-semibold text-slate-800 text-sm">LoyalOps</span>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                            SDK Demo
                        </span>
                    </div>
                </header>

                {/* Main content */}
                <main className="mx-auto max-w-5xl px-4 py-10">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left — missions */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Missions</h1>
                                <p className="mt-1.5 text-slate-400 text-sm">
                                    Complete missions to earn rewards and level up your loyalty.
                                </p>
                            </div>
                            <MissionList />
                        </div>

                        {/* Right — wallet */}
                        <div className="w-full lg:w-72 shrink-0 space-y-4">
                            <div>
                                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                    Wallet
                                </h2>
                                <BalancesCard />
                            </div>
                            <div>
                                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                                    Multipliers
                                </h2>
                                <MultipliersCard />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </LoyalOpsProvider>
    );
}

