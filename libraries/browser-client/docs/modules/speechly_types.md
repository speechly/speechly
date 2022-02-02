[@speechly/browser-client](../README.md) / speechly/types

# Module: speechly/types

## Table of contents

### Interfaces

- [ClientOptions](../interfaces/speechly_types.ClientOptions.md)
- [Segment](../interfaces/speechly_types.Segment.md)
- [Intent](../interfaces/speechly_types.Intent.md)
- [Word](../interfaces/speechly_types.Word.md)
- [Entity](../interfaces/speechly_types.Entity.md)

### Type aliases

- [StateChangeCallback](speechly_types.md#statechangecallback)
- [SegmentChangeCallback](speechly_types.md#segmentchangecallback)
- [TentativeTranscriptCallback](speechly_types.md#tentativetranscriptcallback)
- [TranscriptCallback](speechly_types.md#transcriptcallback)
- [TentativeEntitiesCallback](speechly_types.md#tentativeentitiescallback)
- [EntityCallback](speechly_types.md#entitycallback)
- [IntentCallback](speechly_types.md#intentcallback)

### Enumerations

- [ClientState](../enums/speechly_types.ClientState.md)

## Type aliases

### StateChangeCallback

Ƭ **StateChangeCallback**: (`state`: [`ClientState`](../enums/speechly_types.ClientState.md)) => `void`

#### Type declaration

▸ (`state`): `void`

A callback that is invoked whenever the [client state](../enums/speechly_types.ClientState.md) changes.

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`ClientState`](../enums/speechly_types.ClientState.md) |

##### Returns

`void`

___

### SegmentChangeCallback

Ƭ **SegmentChangeCallback**: (`segment`: [`Segment`](../interfaces/speechly_types.Segment.md)) => `void`

#### Type declaration

▸ (`segment`): `void`

A callback that is invoked whenever current [segment](../interfaces/speechly_types.Segment.md) changes.

##### Parameters

| Name | Type |
| :------ | :------ |
| `segment` | [`Segment`](../interfaces/speechly_types.Segment.md) |

##### Returns

`void`

___

### TentativeTranscriptCallback

Ƭ **TentativeTranscriptCallback**: (`contextId`: `string`, `segmentId`: `number`, `words`: [`Word`](../interfaces/speechly_types.Word.md)[], `text`: `string`) => `void`

#### Type declaration

▸ (`contextId`, `segmentId`, `words`, `text`): `void`

A callback that is invoked whenever a new tentative transcript is received from the API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `words` | [`Word`](../interfaces/speechly_types.Word.md)[] |
| `text` | `string` |

##### Returns

`void`

___

### TranscriptCallback

Ƭ **TranscriptCallback**: (`contextId`: `string`, `segmentId`: `number`, `word`: [`Word`](../interfaces/speechly_types.Word.md)) => `void`

#### Type declaration

▸ (`contextId`, `segmentId`, `word`): `void`

A callback that is invoked whenever a new transcript is received from the API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `word` | [`Word`](../interfaces/speechly_types.Word.md) |

##### Returns

`void`

___

### TentativeEntitiesCallback

Ƭ **TentativeEntitiesCallback**: (`contextId`: `string`, `segmentId`: `number`, `entities`: [`Entity`](../interfaces/speechly_types.Entity.md)[]) => `void`

#### Type declaration

▸ (`contextId`, `segmentId`, `entities`): `void`

A callback that is invoked whenever new tentative entities are received from the API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `entities` | [`Entity`](../interfaces/speechly_types.Entity.md)[] |

##### Returns

`void`

___

### EntityCallback

Ƭ **EntityCallback**: (`contextId`: `string`, `segmentId`: `number`, `entity`: [`Entity`](../interfaces/speechly_types.Entity.md)) => `void`

#### Type declaration

▸ (`contextId`, `segmentId`, `entity`): `void`

A callback that is invoked whenever new entity is received from the API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `entity` | [`Entity`](../interfaces/speechly_types.Entity.md) |

##### Returns

`void`

___

### IntentCallback

Ƭ **IntentCallback**: (`contextId`: `string`, `segmentId`: `number`, `intent`: [`Intent`](../interfaces/speechly_types.Intent.md)) => `void`

#### Type declaration

▸ (`contextId`, `segmentId`, `intent`): `void`

A callback that is invoked whenever new intent (tentative or not) is received from the API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `intent` | [`Intent`](../interfaces/speechly_types.Intent.md) |

##### Returns

`void`
