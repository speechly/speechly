[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Segment](_index_d_.segment.md)

# Interface: Segment

The smallest component of SLU API, defined by an intent.

## Hierarchy

* **Segment**

## Index

### Properties

* [contextId](_index_d_.segment.md#contextid)
* [entities](_index_d_.segment.md#entities)
* [id](_index_d_.segment.md#id)
* [intent](_index_d_.segment.md#intent)
* [isFinal](_index_d_.segment.md#isfinal)
* [words](_index_d_.segment.md#words)

## Properties

###  contextId

• **contextId**: *string*

Defined in index.d.ts:293

The identifier of parent SLU context.

___

###  entities

• **entities**: *[Entity](_index_d_.entity.md)[]*

Defined in index.d.ts:313

All entities which belong to the segment, not ordered.

___

###  id

• **id**: *number*

Defined in index.d.ts:297

The identifier of the segment within the parent context.

___

###  intent

• **intent**: *[Intent](_index_d_.intent.md)*

Defined in index.d.ts:305

The intent of the segment.

___

###  isFinal

• **isFinal**: *boolean*

Defined in index.d.ts:301

Whether the segment is final. A final segment is guaranteed to only contain final parts.

___

###  words

• **words**: *[Word](_index_d_.word.md)[]*

Defined in index.d.ts:309

All words which belong to the segment, ordered by their indices.
