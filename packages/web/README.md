# @loyalops/web

Headless React SDK for [LoyalOps](https://loyalops.com) loyalty programs.
Provides a context provider and data hooks — you bring your own UI.

## Installation

```bash
npm install @loyalops/web
```

**Peer dependencies:** `react >= 18`, `react-dom >= 18`

## Quick Start

Wrap your app (or a section of it) with `<LoyalOpsProvider>`, then use hooks
anywhere inside:

```tsx
import {
    LoyalOpsProvider,
    useMissions,
    useSubmissions,
    useSubmitMission,
} from "@loyalops/web";

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

Generate a JWT token in your backend and pass it as `userToken`. It is sent as
the `x-user-token` header on every API request.

```ts
// Backend
const token = jwt.sign({ sub: user.id }, process.env.LOYALOPS_SECRET);

// Frontend
<LoyalOpsProvider userToken={token} ... />
```

## Provider

### `<LoyalOpsProvider />`

| Prop              | Type          | Required | Description                                              |
| ----------------- | ------------- | -------- | -------------------------------------------------------- |
| `tenantPublicKey` | `string`      | ✓        | Your tenant public key.                                  |
| `userToken`       | `string`      | ✓        | JWT token identifying the user.                          |
| `baseUrl`         | `string`      |          | API base URL. Defaults to `https://api.loyalops.com/v1`. |
| `queryClient`     | `QueryClient` |          | Bring your own react-query client.                       |

## Hooks

All hooks must be used inside `<LoyalOpsProvider>`.

### `useMissions()`

Returns a react-query result with `Mission[]`.

### `useSubmissions()`

Returns a react-query result with `MissionSubmission[]`.

### `useSubmitMission()`

Mutation hook. Call `mutate({ missionId })` to verify/submit a mission.
Automatically invalidates missions and submissions queries on success.

### `useConnectPlatform({ redirectUrl })`

Mutation hook for OAuth connect missions. Pass the URL the OAuth provider should
redirect back to after authorization. Call `mutate("discord")` etc. Redirects
the user to the platform's OAuth page.

### `useBalances({ currencyIds? })`

Returns a react-query result with `UserBalance[]` for the current user.
Optionally pass an array of currency UUIDs to filter the results.

```ts
const { data: balances } = useBalances();
// or filter by specific currencies:
const { data: balances } = useBalances({
    currencyIds: ["currency-uuid-1", "currency-uuid-2"],
});
```

### `useMultipliers()`

Returns a react-query result with `UserMultiplier[]` for the current user.

### `useLoyalOps()`

Returns `{ client, config }` — the underlying `LoyalOpsClient` instance and the
resolved config. Useful for advanced/custom API calls.

## License

MIT
