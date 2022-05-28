[@speechly/browser-client](../README.md) / [speechly](../modules/speechly.md) / Segment

# Interface: Segment

[speechly](../modules/speechly.md).Segment

The smallest component of SLU API, defined by an intent.

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
