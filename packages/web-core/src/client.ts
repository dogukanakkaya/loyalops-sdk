import type { LoyalOpsConfig } from "./types";

export class LoyalOpsClient {
    private baseUrl: string;
    private tenantPublicKey: string;
    private userToken: string;

    constructor(config: LoyalOpsConfig) {
        this.baseUrl = config.baseUrl ?? "https://api.loyalops.com/v1";
        this.tenantPublicKey = config.tenantPublicKey;
        this.userToken = config.userToken;
    }

    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "x-tenant-public-key": this.tenantPublicKey,
            "x-user-token": this.userToken,
            ...(options.headers as Record<string, string> | undefined),
        };

        const res = await fetch(url, { ...options, headers });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new LoyalOpsApiError(
                (body as { message?: string }).message ?? res.statusText,
                res.status,
                body,
            );
        }

        if (res.status === 204) return undefined as T;

        return res.json() as Promise<T>;
    }
}

export class LoyalOpsApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public body: unknown,
    ) {
        super(message);
        this.name = "LoyalOpsApiError";
    }
}
