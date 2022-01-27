[@speechly/react-client](../README.md) / [index](../modules/index.md) / SpeechSegment

# Interface: SpeechSegment

[index](../modules/index.md).SpeechSegment

The smallest component of SLU API, defined by an intent.

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

The identifier of parent SLU context.

___

### id

• **id**: `number`

The identifier of the segment within the parent context.

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
