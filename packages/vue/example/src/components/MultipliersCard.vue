<template>
    <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-800">Multipliers</h2>
            <div class="flex items-center gap-2">
                <span v-if="isLoading" class="size-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
                <span
                    v-if="!isLoading && effectiveMultiplier > 1"
                    class="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full"
                >
                    {{ effectiveMultiplier }}× active
                </span>
            </div>
        </div>

        <div class="px-5">
            <p v-if="error" class="py-4 text-sm text-red-500">Failed to load multipliers.</p>

            <p v-else-if="!isLoading && (!multipliers || multipliers.length === 0)" class="py-4 text-sm text-slate-400">
                No active multipliers.
            </p>

            <template v-else>
                <div
                    v-for="m in multipliers"
                    :key="m.id"
                    :class="['flex items-center justify-between py-3 border-b border-slate-100 last:border-0', isExpired(m.expiresAt) ? 'opacity-45' : '']"
                >
                    <div class="flex items-center gap-2.5">
                        <span class="size-8 flex items-center justify-center rounded-full bg-violet-50 border border-violet-200 text-base">
                            ⚡
                        </span>
                        <div>
                            <span class="text-sm font-medium text-slate-700">Multiplier</span>
                            <p class="text-xs text-slate-400 mt-0.5">{{ formatTimeLeft(m.expiresAt) }}</p>
                        </div>
                    </div>
                    <span class="text-sm font-bold text-violet-600 tabular-nums">{{ m.value }}×</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMultipliers } from "@loyalops/vue";

const { data: multipliers, isLoading, error } = useMultipliers();

const isExpired = (expiresAt: string | null) =>
    !!expiresAt && new Date(expiresAt) <= new Date();

const active = computed(() =>
    multipliers.value?.filter((m) => !m.expiresAt || new Date(m.expiresAt) > new Date()) ?? []
);

const effectiveMultiplier = computed(() =>
    active.value.reduce((acc, m) => acc * m.value, 1)
);

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
</script>
