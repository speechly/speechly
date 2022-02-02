[@speechly/browser-client](../README.md) / [speechly/types](../modules/speechly_types.md) / Segment

# Interface: Segment

[speechly/types](../modules/speechly_types.md).Segment

The smallest component of SLU API, defined by an intent.

## Table of contents

### Properties

- [contextId](speechly_types.Segment.md#contextid)
- [id](speechly_types.Segment.md#id)
- [isFinal](speechly_types.Segment.md#isfinal)
- [intent](speechly_types.Segment.md#intent)
- [words](speechly_types.Segment.md#words)
- [entities](speechly_types.Segment.md#entities)

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

• **intent**: [`Intent`](speechly_types.Intent.md)

The intent of the segment.

___

### words

• **words**: [`Word`](speechly_types.Word.md)[]

All words which belong to the segment, ordered by their indices.

___

### entities

• **entities**: [`Entity`](speechly_types.Entity.md)[]

All entities which belong to the segment, not ordered.
