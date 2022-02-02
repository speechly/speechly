[@speechly/browser-client](../README.md) / speechly/parsers

# Module: speechly/parsers

## Table of contents

### Functions

- [parseTentativeTranscript](speechly_parsers.md#parsetentativetranscript)
- [parseTranscript](speechly_parsers.md#parsetranscript)
- [parseTentativeEntities](speechly_parsers.md#parsetentativeentities)
- [parseEntity](speechly_parsers.md#parseentity)
- [parseIntent](speechly_parsers.md#parseintent)

## Functions

### parseTentativeTranscript

▸ **parseTentativeTranscript**(`data`): [`Word`](../interfaces/speechly_types.Word.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`TentativeTranscriptResponse`](../interfaces/websocket_types.TentativeTranscriptResponse.md) |

#### Returns

[`Word`](../interfaces/speechly_types.Word.md)[]

___

### parseTranscript

▸ **parseTranscript**(`data`): [`Word`](../interfaces/speechly_types.Word.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`TranscriptResponse`](../interfaces/websocket_types.TranscriptResponse.md) |

#### Returns

[`Word`](../interfaces/speechly_types.Word.md)

___

### parseTentativeEntities

▸ **parseTentativeEntities**(`data`): [`Entity`](../interfaces/speechly_types.Entity.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`TentativeEntitiesResponse`](../interfaces/websocket_types.TentativeEntitiesResponse.md) |

#### Returns

[`Entity`](../interfaces/speechly_types.Entity.md)[]

___

### parseEntity

▸ **parseEntity**(`data`): [`Entity`](../interfaces/speechly_types.Entity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`EntityResponse`](../interfaces/websocket_types.EntityResponse.md) |

#### Returns

[`Entity`](../interfaces/speechly_types.Entity.md)

___

### parseIntent

▸ **parseIntent**(`data`, `isFinal`): [`Intent`](../interfaces/speechly_types.Intent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`IntentResponse`](../interfaces/websocket_types.IntentResponse.md) |
| `isFinal` | `boolean` |

#### Returns

[`Intent`](../interfaces/speechly_types.Intent.md)
