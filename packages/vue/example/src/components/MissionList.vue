<template>
    <div>
        <!-- Progress bar -->
        <div v-if="!isLoading && missions && missions.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-slate-600">Progress</span>
                <span class="text-sm text-slate-400">{{ completed.length }} / {{ missions.length }} completed</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    class="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    :style="{ width: `${missions.length ? (completed.length / missions.length) * 100 : 0}%` }"
                />
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="space-y-3">
            <div v-for="i in 4" :key="i" class="w-full rounded-2xl border border-slate-100 bg-white p-5 animate-pulse">
                <div class="flex items-start gap-4">
                    <div class="size-11 rounded-xl bg-slate-100 shrink-0" />
                    <div class="flex-1 space-y-2.5">
                        <div class="h-4 bg-slate-100 rounded-full w-2/5" />
                        <div class="h-3 bg-slate-100 rounded-full w-4/5" />
                        <div class="h-3 bg-slate-100 rounded-full w-1/4" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="missionsError" class="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div class="text-4xl">⚠️</div>
            <p class="text-slate-600 font-medium">Failed to load missions</p>
            <p class="text-sm text-slate-400">{{ (missionsError as Error).message }}</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!missions || missions.length === 0" class="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div class="size-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl">🎯</div>
            <p class="text-slate-600 font-medium">No missions available</p>
            <p class="text-sm text-slate-400">Check back later for new challenges.</p>
        </div>

        <!-- Available missions -->
        <div v-else-if="available.length > 0" class="space-y-3">
            <MissionCard
                v-for="m in available"
                :key="m.id"
                :mission="m"
                :submission="submissionByMission(m.id)"
                @click="selectedMission = m"
            />
        </div>

        <!-- Completed missions -->
        <div v-if="!isLoading && completed.length > 0" class="mt-8 space-y-3">
            <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Completed</h2>
            <MissionCard
                v-for="m in completed"
                :key="m.id"
                :mission="m"
                :submission="submissionByMission(m.id)"
                @click="selectedMission = m"
            />
        </div>

        <!-- Modal -->
        <MissionModal
            v-if="selectedMission"
            :mission="selectedMission"
            :submission="submissionByMission(selectedMission.id)"
            @close="selectedMission = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Mission } from "@loyalops/vue";
import { useMissions, useSubmissions } from "@loyalops/vue";
import MissionCard from "./MissionCard.vue";
import MissionModal from "./MissionModal.vue";

const { data: missions, isLoading: loadingMissions, error: missionsError } = useMissions();
const { data: submissions, isLoading: loadingSubmissions } = useSubmissions();

const isLoading = computed(() => loadingMissions.value || loadingSubmissions.value);

const selectedMission = ref<Mission | null>(null);

const submissionByMission = (missionId: string) =>
    submissions.value?.find((s) => s.missionId === missionId);

const available = computed(() =>
    missions.value?.filter((m) => submissionByMission(m.id)?.status !== "approved") ?? []
);

const completed = computed(() =>
    missions.value?.filter((m) => submissionByMission(m.id)?.status === "approved") ?? []
);
</script>
