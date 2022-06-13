[@speechly/react-client](../README.md) / types

# Module: types

## Table of contents

### Type aliases

- [TentativeSpeechTranscript](types.md#tentativespeechtranscript)
- [SpeechTranscript](types.md#speechtranscript)
- [TentativeSpeechEntities](types.md#tentativespeechentities)
- [SpeechEntity](types.md#speechentity)
- [TentativeSpeechIntent](types.md#tentativespeechintent)
- [SpeechIntent](types.md#speechintent)

### References

- [Word](types.md#word)
- [Entity](types.md#entity)
- [Intent](types.md#intent)
- [SpeechSegment](types.md#speechsegment)

## Type aliases

### TentativeSpeechTranscript

Ƭ **TentativeSpeechTranscript**: `Object`

Wraps the tentative transcript response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `words` | [`Word`](../interfaces/index.Word.md)[] |
| `text` | `string` |

___

### SpeechTranscript

Ƭ **SpeechTranscript**: `Object`

Wraps the final transcript response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `word` | [`Word`](../interfaces/index.Word.md) |

___

### TentativeSpeechEntities

Ƭ **TentativeSpeechEntities**: `Object`

Wraps the tentative entities response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `entities` | [`Entity`](../interfaces/index.Entity.md)[] |

___

### SpeechEntity

Ƭ **SpeechEntity**: `Object`

Wraps the final entity response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `entity` | [`Entity`](../interfaces/index.Entity.md) |

___

### TentativeSpeechIntent

Ƭ **TentativeSpeechIntent**: `Object`

Wraps the tentative intent response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `intent` | [`Intent`](../interfaces/index.Intent.md) |

___

### SpeechIntent

Ƭ **SpeechIntent**: `Object`

Wraps the final intent response from the API.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `contextId` | `string` |
| `segmentId` | `number` |
| `intent` | [`Intent`](../interfaces/index.Intent.md) |

## References

### Word

Re-exports [Word](../interfaces/index.Word.md)

___

### Entity

Re-exports [Entity](../interfaces/index.Entity.md)

___

### Intent

Re-exports [Intent](../interfaces/index.Intent.md)

___

### SpeechSegment

Re-exports [SpeechSegment](../interfaces/index.SpeechSegment.md)
