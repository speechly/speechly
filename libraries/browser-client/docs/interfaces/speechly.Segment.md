[@speechly/browser-client](../README.md) / [speechly](../modules/speechly.md) / Segment

# Interface: Segment

[speechly](../modules/speechly.md).Segment

A structure that accumulates speech recognition (ASR) and natural language understanding (NLU) results.
The segment contains exactly one intent, one or more words and zero or more entities depending on the NLU configuration.

## Table of contents

### Properties

- [contextId](speechly.Segment.md#contextid)
- [id](speechly.Segment.md#id)
- [isFinal](speechly.Segment.md#isfinal)
- [intent](speechly.Segment.md#intent)
- [words](speechly.Segment.md#words)
- [entities](speechly.Segment.md#entities)

## Properties

### contextId

• **contextId**: `string`

Audio context id for the utterance. Unique for the processed audio chunk between start and stop calls.
One utterance may produce one or more segments.

___

### id

• **id**: `number`

0-based segment index within the audio context. Together with [contextId](speechly.Segment.md#contextid) forms an unique identifier for the segment.

___

### isFinal

• **isFinal**: `boolean`

Whether the segment is final. A final segment is guaranteed to only contain final parts.

___

### intent

• **intent**: [`Intent`](speechly.Intent.md)

The intent of the segment.

___

### words

• **words**: [`Word`](speechly.Word.md)[]

All words which belong to the segment, ordered by their indices.

___

### entities

• **entities**: [`Entity`](speechly.Entity.md)[]

All entities which belong to the segment, not ordered.
