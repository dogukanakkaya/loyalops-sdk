<template>
    <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-800">Balances</h2>
            <span v-if="isLoading" class="size-4 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
        </div>

        <div class="px-5">
            <p v-if="error" class="py-4 text-sm text-red-500">Failed to load balances.</p>

            <p v-else-if="!isLoading && (!balances || balances.length === 0)" class="py-4 text-sm text-slate-400">
                No balances yet.
            </p>

            <template v-else>
                <div
                    v-for="balance in balances"
                    :key="balance.id"
                    class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                    <div class="flex items-center gap-2.5">
                        <span class="size-8 flex items-center justify-center rounded-full bg-amber-50 border border-amber-200 text-base">
                            🪙
                        </span>
                        <span class="text-sm font-medium text-slate-700">{{ balance.currency.name }}</span>
                    </div>
                    <span class="text-sm font-bold text-slate-800 tabular-nums">
                        {{ balance.balance.toLocaleString() }} {{ balance.currency.symbol ?? balance.currency.name }}
                    </span>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBalances } from "@loyalops/vue";

const props = defineProps<{ currencyIds?: string[] }>();
const { data: balances, isLoading, error } = useBalances({ currencyIds: props.currencyIds });
</script>
