[@speechly/browser-client](../README.md) / websocket/token

# Module: websocket/token

## Table of contents

### Functions

- [fetchToken](websocket_token.md#fetchtoken)
- [validateToken](websocket_token.md#validatetoken)
- [decodeToken](websocket_token.md#decodetoken)

### Variables

- [minTokenValidTime](websocket_token.md#mintokenvalidtime)

### Interfaces

- [Token](../interfaces/websocket_token.Token.md)

## Functions

### fetchToken

▸ **fetchToken**(`baseUrl`, `projectId`, `appId`, `deviceId`, `fetcher?`, `nowFn?`): `Promise`<`string`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `baseUrl` | `string` | `undefined` |
| `projectId` | `undefined` \| `string` | `undefined` |
| `appId` | `undefined` \| `string` | `undefined` |
| `deviceId` | `string` | `undefined` |
| `fetcher` | `fetchFn` | `fetch` |
| `nowFn` | `nowFn` | `Date.now` |

#### Returns

`Promise`<`string`\>

___

### validateToken

▸ **validateToken**(`token`, `projectId`, `appId`, `deviceId`, `now?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `token` | `string` | `undefined` |
| `projectId` | `undefined` \| `string` | `undefined` |
| `appId` | `undefined` \| `string` | `undefined` |
| `deviceId` | `string` | `undefined` |
| `now` | `nowFn` | `Date.now` |

#### Returns

`boolean`

___

### decodeToken

▸ **decodeToken**(`token`): [`Token`](../interfaces/websocket_token.Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `string` |

#### Returns

[`Token`](../interfaces/websocket_token.Token.md)

## Variables

### minTokenValidTime

• **minTokenValidTime**: `number`
