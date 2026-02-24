import { inject } from "vue";
import { LOYALOPS_KEY } from "../plugin";
import type { LoyalOpsContext } from "../plugin";

export function useLoyalOps(): LoyalOpsContext {
    const ctx = inject(LOYALOPS_KEY);
    if (!ctx) {
        throw new Error(
            "[LoyalOps] useLoyalOps() must be called inside a component mounted under an app with app.use(createLoyalOps(...)).",
        );
    }
    return ctx;
}
