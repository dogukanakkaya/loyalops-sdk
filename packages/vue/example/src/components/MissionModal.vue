<template>
    <Teleport to="body">
        <div
            ref="overlayRef"
            @click="onOverlayClick"
            class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
        >
            <div class="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in">
                <!-- Header -->
                <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
                    <div class="flex items-center gap-3.5">
                        <div
                            class="flex size-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 [&>svg]:size-5.5"
                            v-html="icon"
                        />
                        <div>
                            <h2 class="font-semibold text-slate-800 leading-tight">{{ mission.name }}</h2>
                            <p class="text-xs text-slate-400 mt-0.5 capitalize">{{ mission.type.replace(/_/g, " ") }}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        @click="$emit('close')"
                        class="size-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-5">
                    <p v-if="mission.description" class="text-sm text-slate-500 leading-relaxed">
                        {{ mission.description }}
                    </p>

                    <!-- Connect platform button -->
                    <div v-if="isConnect" class="space-y-1.5">
                        <button
                            type="button"
                            @click="handleConnect"
                            :disabled="connectMutation.isPending.value || isCompleted"
                            :class="[
                                'w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                                'disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:size-4.5',
                                connectButtonClass ?? 'bg-indigo-500 hover:bg-indigo-600 text-white',
                            ]"
                        >
                            <span v-if="connectMutation.isPending.value" class="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            <span v-else v-html="icon" class="[&>svg]:size-4.5" />
                            {{ connectMutation.isPending.value ? 'Redirecting…' : `Connect ${platformLabel}` }}
                        </button>
                    </div>

                    <!-- Action link -->
                    <div v-else-if="actionUrl" class="space-y-1.5">
                        <a
                            :href="actionUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-all"
                        >
                            <span>[↗]</span>
                            {{ actionLabel ?? 'Open link' }}
                        </a>
                    </div>

                    <!-- Rewards -->
                    <div v-if="mission.rewards && mission.rewards.length > 0" class="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <p class="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2.5">Rewards</p>
                        <div class="flex flex-wrap gap-2">
                            <template v-for="r in mission.rewards" :key="r.id">
                                <div v-if="r.type === 'currency' && r.currency" class="flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                                    <span>🪙</span>
                                    <span>{{ currencyValue(r.config) }} {{ r.currency.symbol ?? r.currency.name }}</span>
                                </div>
                                <div v-else-if="r.type === 'multiplier'" class="flex items-center gap-1.5 text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
                                    <span>⚡</span>
                                    <span>{{ multiplierValue(r.config) }}× multiplier</span>
                                </div>
                                <div v-else-if="r.type === 'external'" class="flex items-center gap-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full">
                                    <span>🎁</span>
                                    <span>{{ externalDescription(r.config) }}</span>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Error -->
                    <div v-if="mutationError" class="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
                        <span class="shrink-0">⚠</span>
                        <span>{{ (mutationError as Error).message ?? 'Something went wrong.' }}</span>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-5 pb-5">
                    <div v-if="showSuccess" class="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span>✓</span> Submitted!
                    </div>
                    <div v-else-if="isCompleted" class="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span>✓</span> Completed
                    </div>
                    <div v-else-if="isPending" class="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl">
                        <span class="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Under review
                    </div>
                    <button
                        v-if="!isCompleted"
                        type="button"
                        @click="handleSubmit"
                        :disabled="submitMutation.isPending.value"
                        class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span v-if="submitMutation.isPending.value" class="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        {{ submitMutation.isPending.value ? 'Submitting…' : 'Mark as complete' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Mission, MissionSubmission } from "@loyalops/vue";
import { useSubmitMission, useConnectPlatform } from "@loyalops/vue";
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

const props = defineProps<{
    mission: Mission;
    submission?: MissionSubmission;
}>();

const emit = defineEmits<{ close: [] }>();

const submitMutation = useSubmitMission();
const connectMutation = useConnectPlatform({ redirectUrl: REDIRECT_URL });

const showSuccess = ref(false);
const overlayRef = ref<HTMLDivElement | null>(null);

const isCompleted = computed(() => props.submission?.status === "approved");
const isPending = computed(() => props.submission?.status === "pending");
const isConnect = computed(() => CONNECT_PLATFORM_TYPES.has(props.mission.type));
const actionUrl = computed(() => getMissionActionUrl(props.mission.type, props.mission.config));
const actionLabel = computed(() => getMissionActionLabel(props.mission.type));
const connectButtonClass = computed(() => CONNECT_BUTTON_CLASS[props.mission.type]);
const icon = computed(() => MISSION_TYPE_ICONS[props.mission.type] ?? "");
const platformLabel = computed(() => {
    const raw = props.mission.type.replace("connect_", "");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
});
const mutationError = computed(() => submitMutation.error.value ?? connectMutation.error.value);

const currencyValue = (config: unknown) => (config as { value?: number } | null)?.value;
const multiplierValue = (config: unknown) => (config as { value?: number } | null)?.value;
const externalDescription = (config: unknown) =>
    (config as { description?: string } | null)?.description ?? "External reward";

const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") emit("close"); };

onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
});

onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
    document.body.style.overflow = "";
});

const onOverlayClick = (e: MouseEvent) => {
    if (e.target === overlayRef.value) emit("close");
};

const handleSubmit = async () => {
    try {
        await submitMutation.mutateAsync({ missionId: props.mission.id });
        showSuccess.value = true;
        setTimeout(() => emit("close"), 1200);
    } catch { /* error rendered above */ }
};

const handleConnect = async () => {
    const platform = props.mission.type.replace("connect_", "");
    await connectMutation.mutateAsync(platform);
};
</script>
