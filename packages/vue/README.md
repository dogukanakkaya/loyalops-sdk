# @loyalops/vue

Headless Vue 3 SDK for [LoyalOps](https://loyalops.com) loyalty programs.
Provides a Vue plugin and composables — you bring your own UI.

## Installation

```bash
npm install @loyalops/vue
```

**Peer dependencies:** `vue >= 3.3`

TanStack Query is included as a dependency — no need to install it separately.
If you already use it in your app you can pass your own options via `vueQuery`
(see below).

## Quick Start

Register the plugin in your app entry, then use composables anywhere in your
component tree:

```ts
// main.ts
import { createApp } from "vue";
import { createLoyalOps } from "@loyalops/vue";
import App from "./App.vue";

const app = createApp(App);

app.use(createLoyalOps({
    tenantPublicKey: "your-tenant-public-key",
    userToken: userToken,
}));

app.mount("#app");
```

```vue
<script setup lang="ts">
import { useMissions, useSubmitMission } from "@loyalops/vue";

const { data: missions, isLoading } = useMissions();
const submit = useSubmitMission();
</script>

<template>
    <p v-if="isLoading">Loading…</p>
    <ul v-else>
        <li v-for="m in missions" :key="m.id">
            {{ m.name }}
            <button @click="submit.mutate({ missionId: m.id })">Complete</button>
        </li>
    </ul>
</template>
```

## Authentication

Generate a JWT on your backend and pass it as `userToken`. It is sent as the
`x-user-token` header on every API request.

```ts
// Backend
const token = jwt.sign({ sub: user.id }, process.env.LOYALOPS_SECRET);

// Frontend
app.use(createLoyalOps({ userToken: token, ... }));
```

## Plugin

### `createLoyalOps(options)`

Creates a Vue plugin. Install it with `app.use(...)`.

| Option            | Type                    | Required | Description                                                        |
| ----------------- | ----------------------- | -------- | ------------------------------------------------------------------ |
| `tenantPublicKey` | `string`                | ✓        | Your tenant public key.                                            |
| `userToken`       | `string`                | ✓        | JWT identifying the current user (must have a `sub` claim).        |
| `baseUrl`         | `string`                |          | API base URL. Defaults to `https://api.loyalops.com/v1`.           |
| `vueQuery`        | `VueQueryPluginOptions` |          | Options forwarded to `VueQueryPlugin` (e.g. custom `QueryClient`). |

## Composables

All composables must be called inside a component mounted under an app that has
`createLoyalOps` installed.

### `useMissions()`

Returns a TanStack Query result with `Mission[]`.

### `useSubmissions()`

Returns a TanStack Query result with `MissionSubmission[]` for the current user.

### `useSubmitMission()`

Mutation composable. Call `mutate({ missionId, userData? })` to submit a
mission. `userData` is an optional free-form object forwarded to the backend
(useful for quiz answers, codes, etc.). Automatically invalidates the missions
and submissions queries on success.

```ts
const submit = useSubmitMission();

// Simple submit
submit.mutate({ missionId: "abc" });

// With extra data (e.g. quiz answer)
submit.mutate({ missionId: "abc", userData: { answer: "42" } });
```

### `useConnectPlatform({ redirectUrl })`

Mutation composable for OAuth connect missions. `redirectUrl` is where the OAuth
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
