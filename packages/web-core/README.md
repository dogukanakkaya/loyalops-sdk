# @loyalops/web-core

Framework-agnostic HTTP client and shared types for the
[LoyalOps](https://loyalops.com) SDK.

> **Note:** This package is bundled into `@loyalops/react`, `@loyalops/vue`, and
> `@loyalops/react-native`. You do not need to install it directly unless you
> are building a custom framework integration.

## Installation

```bash
npm install @loyalops/web-core
```

## Usage

```ts
import { LoyalOpsClient } from "@loyalops/web-core";

const client = new LoyalOpsClient({
    tenantPublicKey: "your-tenant-public-key",
    userToken: userToken,
    // baseUrl: "https://api.loyalops.com/v1", // default
});

const missions = await client.request<Mission[]>("/missions");
```

## Exports

### `LoyalOpsClient`

Configured HTTP client for the LoyalOps API.

| Constructor Option | Type     | Required | Description                                              |
| ------------------ | -------- | -------- | -------------------------------------------------------- |
| `tenantPublicKey`  | `string` | ✓        | Your tenant public key.                                  |
| `userToken`        | `string` | ✓        | JWT identifying the current user.                        |
| `baseUrl`          | `string` |          | API base URL. Defaults to `https://api.loyalops.com/v1`. |

#### `.request<T>(path, options?)`

Makes an authenticated request to the LoyalOps API. Throws `LoyalOpsApiError` on
non-2xx responses.

### `LoyalOpsApiError`

Error class thrown on non-2xx API responses. Exposes `status: number` and
`body: unknown`.

### `parseUserIdFromToken(token)`

Parses the `sub` claim from a JWT string without verifying the signature.

### Types

All TypeScript types are re-exported for convenience:

`Mission`, `MissionSubmission`, `MissionReward`, `MissionType`, `MissionStatus`,
`MissionFrequency`, `SubmissionStatus`, `RewardType`, `CurrencyRewardConfig`,
`MultiplierRewardConfig`, `ExternalRewardConfig`, `Currency`, `Platform`,
`LoyalOpsConfig`, `UserBalance`, `UserMultiplier`.

## License

MIT
