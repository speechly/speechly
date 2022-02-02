[@speechly/browser-client](../README.md) / [speechly/client](../modules/speechly_client.md) / Client

# Class: Client

[speechly/client](../modules/speechly_client.md).Client

A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.

## Table of contents

### Constructors

- [constructor](speechly_client.Client.md#constructor)

### Methods

- [connect](speechly_client.Client.md#connect)
- [initialize](speechly_client.Client.md#initialize)
- [close](speechly_client.Client.md#close)
- [switchContext](speechly_client.Client.md#switchcontext)
- [startContext](speechly_client.Client.md#startcontext)
- [stopContext](speechly_client.Client.md#stopcontext)
- [onStateChange](speechly_client.Client.md#onstatechange)
- [onSegmentChange](speechly_client.Client.md#onsegmentchange)
- [onTentativeTranscript](speechly_client.Client.md#ontentativetranscript)
- [onTranscript](speechly_client.Client.md#ontranscript)
- [onTentativeEntities](speechly_client.Client.md#ontentativeentities)
- [onEntity](speechly_client.Client.md#onentity)
- [onTentativeIntent](speechly_client.Client.md#ontentativeintent)
- [onIntent](speechly_client.Client.md#onintent)
- [printStats](speechly_client.Client.md#printstats)

## Constructors

### constructor

• **new Client**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ClientOptions`](../interfaces/speechly_types.ClientOptions.md) |

## Methods

### connect

▸ **connect**(): `Promise`<`void`\>

Connect to Speechly backend.
This function will be called by initialize if not manually called earlier.
Calling connect() immediately after constructor and setting callbacks allows
prewarming the connection, resulting in less noticeable waits for the user.

#### Returns

`Promise`<`void`\>

___

### initialize

▸ **initialize**(): `Promise`<`void`\>

Initializes the client, by initializing the microphone and establishing connection to the API.

This function HAS to be invoked by a user by e.g. binding it to a button press,
or some other user-performed action.

If this function is invoked without a user interaction,
the microphone functionality will not work due to security restrictions by the browser.

#### Returns

`Promise`<`void`\>

___

### close

▸ **close**(): `Promise`<`void`\>

Closes the client by closing the API connection and disabling the microphone.

#### Returns

`Promise`<`void`\>

___

### switchContext

▸ **switchContext**(`appId`): `Promise`<`void`\>

Stops current context and immediately starts a new SLU context
by sending a start context event to the API and unmuting the microphone.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appId` | `string` | unique identifier of an app in the dashboard. |

#### Returns

`Promise`<`void`\>

___

### startContext

▸ **startContext**(`appId?`): `Promise`<`string`\>

Starts a new SLU context by sending a start context event to the API and unmuting the microphone.

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId?` | `string` |

#### Returns

`Promise`<`string`\>

___

### stopContext

▸ **stopContext**(): `Promise`<`string`\>

Stops current SLU context by sending a stop context event to the API and muting the microphone
delayed by contextStopDelay = 250 ms

#### Returns

`Promise`<`string`\>

___

### onStateChange

▸ **onStateChange**(`cb`): `void`

Adds a listener for client state change events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`StateChangeCallback`](../modules/speechly_types.md#statechangecallback) | the callback to invoke on state change events. |

#### Returns

`void`

___

### onSegmentChange

▸ **onSegmentChange**(`cb`): `void`

Adds a listener for current segment change events.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`SegmentChangeCallback`](../modules/speechly_types.md#segmentchangecallback) | the callback to invoke on segment change events. |

#### Returns

`void`

___

### onTentativeTranscript

▸ **onTentativeTranscript**(`cb`): `void`

Adds a listener for tentative transcript responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`TentativeTranscriptCallback`](../modules/speechly_types.md#tentativetranscriptcallback) | the callback to invoke on a tentative transcript response. |

#### Returns

`void`

___

### onTranscript

▸ **onTranscript**(`cb`): `void`

Adds a listener for transcript responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`TranscriptCallback`](../modules/speechly_types.md#transcriptcallback) | the callback to invoke on a transcript response. |

#### Returns

`void`

___

### onTentativeEntities

▸ **onTentativeEntities**(`cb`): `void`

Adds a listener for tentative entities responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`TentativeEntitiesCallback`](../modules/speechly_types.md#tentativeentitiescallback) | the callback to invoke on a tentative entities response. |

#### Returns

`void`

___

### onEntity

▸ **onEntity**(`cb`): `void`

Adds a listener for entity responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`EntityCallback`](../modules/speechly_types.md#entitycallback) | the callback to invoke on an entity response. |

#### Returns

`void`

___

### onTentativeIntent

▸ **onTentativeIntent**(`cb`): `void`

Adds a listener for tentative intent responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`IntentCallback`](../modules/speechly_types.md#intentcallback) | the callback to invoke on a tentative intent response. |

#### Returns

`void`

___

### onIntent

▸ **onIntent**(`cb`): `void`

Adds a listener for intent responses from the API.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | [`IntentCallback`](../modules/speechly_types.md#intentcallback) | the callback to invoke on an intent response. |

#### Returns

`void`

___

### printStats

▸ **printStats**(): `void`

print statistics to console

#### Returns

`void`
