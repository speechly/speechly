[@speechly/browser-client](../README.md) / [speechly/segment](../modules/speechly_segment.md) / SegmentState

# Class: SegmentState

[speechly/segment](../modules/speechly_segment.md).SegmentState

## Table of contents

### Constructors

- [constructor](speechly_segment.SegmentState.md#constructor)

### Properties

- [id](speechly_segment.SegmentState.md#id)
- [contextId](speechly_segment.SegmentState.md#contextid)
- [isFinalized](speechly_segment.SegmentState.md#isfinalized)
- [words](speechly_segment.SegmentState.md#words)
- [entities](speechly_segment.SegmentState.md#entities)
- [intent](speechly_segment.SegmentState.md#intent)

### Methods

- [toSegment](speechly_segment.SegmentState.md#tosegment)
- [toString](speechly_segment.SegmentState.md#tostring)
- [updateTranscript](speechly_segment.SegmentState.md#updatetranscript)
- [updateEntities](speechly_segment.SegmentState.md#updateentities)
- [updateIntent](speechly_segment.SegmentState.md#updateintent)
- [finalize](speechly_segment.SegmentState.md#finalize)

## Constructors

### constructor

• **new SegmentState**(`ctxId`, `sId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ctxId` | `string` |
| `sId` | `number` |

## Properties

### id

• **id**: `number`

___

### contextId

• **contextId**: `string`

___

### isFinalized

• **isFinalized**: `boolean` = `false`

___

### words

• **words**: [`Word`](../interfaces/speechly_types.Word.md)[] = `[]`

___

### entities

• **entities**: `Map`<`string`, [`Entity`](../interfaces/speechly_types.Entity.md)\>

___

### intent

• **intent**: [`Intent`](../interfaces/speechly_types.Intent.md)

## Methods

### toSegment

▸ **toSegment**(): [`Segment`](../interfaces/speechly_types.Segment.md)

#### Returns

[`Segment`](../interfaces/speechly_types.Segment.md)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

___

### updateTranscript

▸ **updateTranscript**(`words`): [`SegmentState`](speechly_segment.SegmentState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `words` | [`Word`](../interfaces/speechly_types.Word.md)[] |

#### Returns

[`SegmentState`](speechly_segment.SegmentState.md)

___

### updateEntities

▸ **updateEntities**(`entities`): [`SegmentState`](speechly_segment.SegmentState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `entities` | [`Entity`](../interfaces/speechly_types.Entity.md)[] |

#### Returns

[`SegmentState`](speechly_segment.SegmentState.md)

___

### updateIntent

▸ **updateIntent**(`intent`): [`SegmentState`](speechly_segment.SegmentState.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `intent` | [`Intent`](../interfaces/speechly_types.Intent.md) |

#### Returns

[`SegmentState`](speechly_segment.SegmentState.md)

___

### finalize

▸ **finalize**(): [`SegmentState`](speechly_segment.SegmentState.md)

#### Returns

[`SegmentState`](speechly_segment.SegmentState.md)
