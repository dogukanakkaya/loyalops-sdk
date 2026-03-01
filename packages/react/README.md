# @loyalops/react

Headless React SDK for [LoyalOps](https://loyalops.com) loyalty programs.
Provides a context provider and data hooks — you bring your own UI.

## Installation

```bash
npm install @loyalops/react
```

**Peer dependencies:** `react >= 18`, `react-dom >= 18`

TanStack Query is included as a dependency — no need to install it separately.
If you already use it in your app you can pass your own `QueryClient` via the
provider (see below).

## Quick Start

Wrap your app (or a section of it) with `<LoyalOpsProvider>`, then use hooks
anywhere inside:

```tsx
import {
    LoyalOpsProvider,
    useMissions,
    useSubmissions,
    useSubmitMission,
} from "@loyalops/react";

function App() {
    return (
        <LoyalOpsProvider
            tenantPublicKey="your-tenant-public-key"
            userToken={userToken}
        >
            <MissionsList />
        </LoyalOpsProvider>
    );
}

function MissionsList() {
    const { data: missions, isLoading } = useMissions();
    const { data: submissions } = useSubmissions();
    const submit = useSubmitMission();

    if (isLoading) return <p>Loading…</p>;

    return (
        <ul>
            {missions?.map((m) => (
                <li key={m.id}>
                    {m.name}
                    <button onClick={() => submit.mutate({ missionId: m.id })}>
                        Complete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

## Authentication

Generate a JWT on your backend and pass it as `userToken`. It is sent as the
`x-user-token` header on every API request.

```ts
// Backend
const token = jwt.sign({ sub: user.id }, process.env.LOYALOPS_SECRET);

// Frontend
<LoyalOpsProvider userToken={token} ... />
```

## Provider

### `<LoyalOpsProvider />`

| Prop              | Type          | Required | Description                                                 |
| ----------------- | ------------- | -------- | ----------------------------------------------------------- |
| `tenantPublicKey` | `string`      | ✓        | Your tenant public key.                                     |
| `userToken`       | `string`      | ✓        | JWT identifying the current user (must have a `sub` claim). |
| `baseUrl`         | `string`      |          | API base URL. Defaults to `https://api.loyalops.com/v1`.    |
| `queryClient`     | `QueryClient` |          | Bring your own TanStack Query client.                       |

## Hooks

All hooks must be used inside `<LoyalOpsProvider>`.

### `useMissions()`

Returns a TanStack Query result with `Mission[]`.

### `useSubmissions()`

Returns a TanStack Query result with `MissionSubmission[]` for the current user.

### `useSubmitMission()`

Mutation hook. Call `mutate({ missionId, userData? })` to submit a mission.
`userData` is an optional free-form object forwarded to the backend (useful for
quiz answers, codes, etc.). Automatically invalidates the missions and
submissions queries on success.

```ts
const submit = useSubmitMission();

// Simple submit
submit.mutate({ missionId: "abc" });

// With extra data (e.g. quiz answer)
submit.mutate({ missionId: "abc", userData: { answer: "42" } });
```

### `useConnectPlatform({ redirectUrl })`

Mutation hook for OAuth connect missions. `redirectUrl` is where the OAuth
provider sends the user back after authorization. Call `mutate("discord")`,
`mutate("x")`, etc. — the user is redirected to the platform's OAuth page.

```ts
const connect = useConnectPlatform({ redirectUrl: window.location.href });
connect.mutate("discord");
```

### `useBalances({ currencyIds? })`

Returns a TanStack Query result with `UserBalance[]` for the current user.
Optionally pass an array of currency UUIDs to filter the results.

```ts
const { data: balances } = useBalances();
// or filter by specific currencies:
const { data: balances } = useBalances({
    currencyIds: ["currency-uuid-1", "currency-uuid-2"],
});
```

### `useMultipliers()`

Returns a TanStack Query result with `UserMultiplier[]` for the current user.

## License

MIT
