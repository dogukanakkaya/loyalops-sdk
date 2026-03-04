# @loyalops/react-native

React Native SDK for [LoyalOps](https://loyalops.com) loyalty programs.

This package re-exports everything from
[`@loyalops/react`](https://www.npmjs.com/package/@loyalops/react) with a single
difference: it only requires `react` as a peer dependency — no `react-dom` —
making it safe to install in React Native projects without peer dependency
warnings.

## Installation

```bash
npm install @loyalops/react-native
```

**Peer dependencies:** `react >= 18`

TanStack Query is included as a dependency — no need to install it separately.

## Usage

Identical to `@loyalops/react` — just change the import path:

```tsx
import {
    LoyalOpsProvider,
    useBalances,
    useMissions,
} from "@loyalops/react-native";
```

### Provider setup

```tsx
import { LoyalOpsProvider } from "@loyalops/react-native";

export default function App() {
    return (
        <LoyalOpsProvider
            tenantPublicKey="your-public-key"
            userToken={userToken}
            baseUrl="https://api.loyalops.com/v1"
        >
            <YourApp />
        </LoyalOpsProvider>
    );
}
```

### Hooks

All hooks from `@loyalops/react` are available:

```tsx
import {
    useBalances,
    useConnectPlatform,
    useLeaderboard,
    useMissions,
    useMultipliers,
    useRank,
    useSubmissions,
    useSubmitMission,
} from "@loyalops/react-native";

function MissionsScreen() {
    const { data: missions, isLoading } = useMissions();
    const { data: submissions } = useSubmissions();
    const { data: balances } = useBalances();
    const { data: multipliers } = useMultipliers();
    const { data: ranks } = useRank();
    const { data: leaderboard } = useLeaderboard();
    const { mutate: submit } = useSubmitMission();
    const connect = useConnectPlatform({ redirectUrl: "myapp://redirect" });

    // ...
}
```

See the
[`@loyalops/react` documentation](https://www.npmjs.com/package/@loyalops/react)
for the full API reference including hook options and return types.

## License

MIT
