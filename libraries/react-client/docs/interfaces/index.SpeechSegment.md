[@speechly/react-client](../README.md) / [index](../modules/index.md) / SpeechSegment

# Interface: SpeechSegment

[index](../modules/index.md).SpeechSegment

A structure that accumulates speech recognition (ASR) and natural language understanding (NLU) results.
The segment contains exactly one intent, one or more words and zero or more entities depending on the NLU configuration.

## Table of contents

### Properties

- [contextId](index.SpeechSegment.md#contextid)
- [id](index.SpeechSegment.md#id)
- [isFinal](index.SpeechSegment.md#isfinal)
- [intent](index.SpeechSegment.md#intent)
- [words](index.SpeechSegment.md#words)
- [entities](index.SpeechSegment.md#entities)

## Properties

### contextId

• **contextId**: `string`

Audio context id for the utterance. Unique for the processed audio chunk between start and stop calls.
One utterance may produce one or more segments.

___

### id

• **id**: `number`

0-based segment index within the audio context. Together with [contextId](index.SpeechSegment.md#contextid) forms an unique identifier for the segment.

___

### isFinal

• **isFinal**: `boolean`

Whether the segment is final. A final segment is guaranteed to only contain final parts.

___

### intent

• **intent**: [`Intent`](index.Intent.md)

The intent of the segment.

___

### words

• **words**: [`Word`](index.Word.md)[]

All words which belong to the segment, ordered by their indices.

___

### entities

• **entities**: [`Entity`](index.Entity.md)[]

All entities which belong to the segment, not ordered.
