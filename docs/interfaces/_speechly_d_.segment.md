[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [Segment](_speechly_d_.segment.md)

# Interface: Segment

The smallest component of SLU API, defined by an intent.

## Hierarchy

* **Segment**

## Index

### Properties

* [contextId](_speechly_d_.segment.md#contextid)
* [entities](_speechly_d_.segment.md#entities)
* [id](_speechly_d_.segment.md#id)
* [intent](_speechly_d_.segment.md#intent)
* [isFinal](_speechly_d_.segment.md#isfinal)
* [words](_speechly_d_.segment.md#words)

## Properties

###  contextId

• **contextId**: *string*

Defined in speechly.d.ts:218

The identifier of parent SLU context.

___

###  entities

• **entities**: *[Entity](_speechly_d_.entity.md)[]*

Defined in speechly.d.ts:238

All entities which belong to the segment, not ordered.

___

###  id

• **id**: *number*

Defined in speechly.d.ts:222

The identifier of the segment within the parent context.

___

###  intent

• **intent**: *[Intent](_speechly_d_.intent.md)*

Defined in speechly.d.ts:230

The intent of the segment.

___

###  isFinal

• **isFinal**: *boolean*

Defined in speechly.d.ts:226

Whether the segment is final. A final segment is guaranteed to only contain final parts.

___

###  words

• **words**: *[Word](_speechly_d_.word.md)[]*

Defined in speechly.d.ts:234

All words which belong to the segment, ordered by their indices.
