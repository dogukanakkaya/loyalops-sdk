import { createContext, useContext, useMemo, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoyalOpsClient } from "@loyalops/web-core";
import type { LoyalOpsConfig } from "@loyalops/web-core";

export interface LoyalOpsContextValue {
    client: LoyalOpsClient;
    config: LoyalOpsConfig;
}

const LoyalOpsContext = createContext<LoyalOpsContextValue | null>(null);

export interface LoyalOpsProviderProps extends LoyalOpsConfig {
    children: ReactNode;
    queryClient?: QueryClient;
}

const internalQueryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

export function LoyalOpsProvider({
    tenantPublicKey,
    userToken,
    baseUrl,
    queryClient: externalQueryClient,
    children,
}: LoyalOpsProviderProps) {
    const client = new LoyalOpsClient({ tenantPublicKey, userToken, baseUrl });

    const queryClient = externalQueryClient ?? internalQueryClient;

    const contextValue = useMemo<LoyalOpsContextValue>(
        () => ({ client, config: { tenantPublicKey, userToken, baseUrl } }),
        [client, tenantPublicKey, userToken, baseUrl]
    );

    return (
        <LoyalOpsContext.Provider value={contextValue}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </LoyalOpsContext.Provider>
    );
}

export function useLoyalOps(): LoyalOpsContextValue {
    const ctx = useContext(LoyalOpsContext);
    if (!ctx) {
        throw new Error(
            "useLoyalOps must be used inside <LoyalOpsProvider>."
        );
    }
    return ctx;
}
