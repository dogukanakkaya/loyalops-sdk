import type { App, InjectionKey } from "vue";
import { VueQueryPlugin, type VueQueryPluginOptions } from "@tanstack/vue-query";
import { LoyalOpsClient } from "@loyalops/web-core";
import type { LoyalOpsConfig } from "@loyalops/web-core";

export interface LoyalOpsContext {
    client: LoyalOpsClient;
    config: LoyalOpsConfig;
}

export const LOYALOPS_KEY: InjectionKey<LoyalOpsContext> = Symbol("loyalops");

export interface CreateLoyalOpsOptions extends LoyalOpsConfig {
    /** Optionally pass custom VueQueryPlugin options (e.g. your own QueryClient). */
    vueQuery?: VueQueryPluginOptions;
}

/**
 * Creates a Vue plugin that provides the LoyalOps context and installs
 * TanStack Query for you.
 *
 * @example
 * // main.ts
 * import { createApp } from 'vue'
 * import { createLoyalOps } from '@loyalops/vue'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 * app.use(createLoyalOps({ tenantPublicKey: '...', userToken: '...' }))
 * app.mount('#app')
 */
export function createLoyalOps({ vueQuery, ...config }: CreateLoyalOpsOptions) {
    return {
        install(app: App) {
            const client = new LoyalOpsClient(config);
            app.provide(LOYALOPS_KEY, { client, config });
            app.use(VueQueryPlugin, vueQuery ?? {});
        },
    };
}
