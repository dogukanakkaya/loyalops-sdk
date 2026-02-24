<template>
    <div class="min-h-screen bg-slate-50 antialiased">
        <!-- Top bar -->
        <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div class="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                    <div class="size-7 rounded-lg bg-indigo-500 flex items-center justify-center">
                        <span class="text-xs font-bold text-white">L</span>
                    </div>
                    <span class="font-semibold text-slate-800 text-sm">LoyalOps</span>
                </div>
                <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-mono">
                    SDK Demo
                </span>
            </div>
        </header>

        <!-- Main content -->
        <main class="mx-auto max-w-5xl px-4 py-10">
            <div class="flex flex-col lg:flex-row gap-8 items-start">
                <!-- Left — missions -->
                <div class="flex-1 min-w-0">
                    <div class="mb-8">
                        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Missions</h1>
                        <p class="mt-1.5 text-slate-400 text-sm">
                            Complete missions to earn rewards and level up your loyalty.
                        </p>
                    </div>
                    <MissionList />
                </div>

                <!-- Right — wallet -->
                <div class="w-full lg:w-72 shrink-0 space-y-4">
                    <div>
                        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                            Wallet
                        </h2>
                        <BalancesCard />
                    </div>
                    <div>
                        <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                            Multipliers
                        </h2>
                        <MultipliersCard />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import MissionList from "./components/MissionList.vue";
import BalancesCard from "./components/BalancesCard.vue";
import MultipliersCard from "./components/MultipliersCard.vue";
</script>
