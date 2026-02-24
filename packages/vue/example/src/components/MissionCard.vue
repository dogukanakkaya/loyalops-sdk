<template>
    <button
        type="button"
        @click="$emit('click')"
        :class="[
            'group w-full text-left rounded-2xl border bg-white transition-all duration-200 cursor-pointer overflow-hidden',
            isCompleted
                ? 'border-slate-200 opacity-70'
                : 'border-slate-200 hover:border-indigo-300 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.18)]',
        ]"
    >
        <div class="p-5">
            <div class="flex items-start gap-4">
                <!-- Icon -->
                <div
                    :class="[
                        'flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm [&>svg]:size-6',
                        isCompleted ? 'bg-slate-100' : 'bg-white border border-slate-200 group-hover:border-indigo-200',
                    ]"
                    v-html="icon"
                />

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                        <h3 :class="['font-semibold leading-snug', isCompleted ? 'text-slate-400 line-through' : 'text-slate-800']">
                            {{ mission.name }}
                        </h3>
                        <span v-if="isCompleted" class="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <span>✓</span> Done
                        </span>
                        <span v-else-if="isPending" class="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                            <span class="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Review
                        </span>
                    </div>

                    <p v-if="mission.description" class="mt-1 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {{ mission.description }}
                    </p>

                    <div class="mt-3 flex items-center gap-3 flex-wrap">
                        <!-- Frequency -->
                        <span class="inline-flex items-center gap-1 text-xs text-slate-400">
                            <span>🔁</span>
                            {{ FREQUENCY_LABELS[mission.frequency] ?? mission.frequency }}
                        </span>

                        <!-- Rewards -->
                        <template v-for="r in mission.rewards" :key="r.id">
                            <span v-if="r.type === 'currency' && r.currency" class="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                🪙 {{ currencyAmount(r.config) }} {{ r.currency.symbol ?? r.currency.name }}
                            </span>
                            <span v-else-if="r.type === 'multiplier'" class="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                                ⚡ {{ multiplierValue(r.config) }}x
                            </span>
                        </template>
                    </div>
                </div>

                <!-- Arrow -->
                <span v-if="!isCompleted" class="shrink-0 self-center text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all text-sm">
                    →
                </span>
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Mission, MissionSubmission, MissionFrequency } from "@loyalops/vue";
import { MISSION_TYPE_ICONS } from "../utils/mission-icons";

const props = defineProps<{
    mission: Mission;
    submission?: MissionSubmission;
}>();

defineEmits<{ click: [] }>();

const FREQUENCY_LABELS: Record<MissionFrequency, string> = {
    once: "One-time",
    hourly: "Hourly",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
};

const isCompleted = computed(() => props.submission?.status === "approved");
const isPending = computed(() => props.submission?.status === "pending");
const icon = computed(() => MISSION_TYPE_ICONS[props.mission.type] ?? "");

const currencyAmount = (config: unknown) => (config as { amount?: number } | null)?.amount;
const multiplierValue = (config: unknown) => (config as { value?: number } | null)?.value;
</script>
