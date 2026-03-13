import { useMutation } from "@tanstack/react-query";
import type { NonceResponse, WalletType } from "@loyalops/web-core";
import { useLoyalOps } from "../context/loyalops-provider";

export function useNonce() {
    const { client } = useLoyalOps();

    return useMutation<NonceResponse, Error, { address: string; network: WalletType }>({
        mutationFn: ({ address, network }) => {
            const params = new URLSearchParams({ address, network });
            return client.request<NonceResponse>(`/sdk/web3/nonce?${params}`);
        },
    });
}
