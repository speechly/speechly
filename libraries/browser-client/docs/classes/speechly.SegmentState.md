[@speechly/browser-client](../README.md) / [speechly](../modules/speechly.md) / SegmentState

# Class: SegmentState

[speechly](../modules/speechly.md).SegmentState

A high level API for automatic speech recognition (ASR) and natural language understanding (NLU) results. Results will accumulate in Segment for the duration of the an utterance.

## Table of contents

### Properties

- [contextId](speechly.SegmentState.md#contextid)
- [id](speechly.SegmentState.md#id)
- [isFinalized](speechly.SegmentState.md#isfinalized)
- [words](speechly.SegmentState.md#words)
- [entities](speechly.SegmentState.md#entities)
- [intent](speechly.SegmentState.md#intent)

### Methods

- [toSegment](speechly.SegmentState.md#tosegment)
- [toString](speechly.SegmentState.md#tostring)

## Properties

### contextId

• **contextId**: `string`

Audio context id, an identifier for the audio chunk processed during start and stop calls.
There may be one or more segments in one context.

___

### id

• **id**: `number`

0-based segment index within the audio context. Together with [contextId](speechly.SegmentState.md#contextid) forms an unique identifier for the segment.

___

### isFinalized

• **isFinalized**: `boolean` = `false`

True when the segment will not be changed any more

___

### words

• **words**: [`Word`](../interfaces/speechly.Word.md)[] = `[]`

Detected words in the segment

___

### entities

• **entities**: `Map`<`string`, [`Entity`](../interfaces/speechly.Entity.md)\>

Detected entities in the segment

___

### intent

• **intent**: [`Intent`](../interfaces/speechly.Intent.md)

Detected intent for the segment

## Methods

### toSegment

▸ **toSegment**(): [`Segment`](../interfaces/speechly.Segment.md)

#### Returns

[`Segment`](../interfaces/speechly.Segment.md)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`
