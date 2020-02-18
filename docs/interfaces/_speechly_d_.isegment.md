[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [ISegment](_speechly_d_.isegment.md)

# Interface: ISegment

The smallest component of SLU API, defined by an intent.

## Hierarchy

* **ISegment**

## Index

### Properties

* [contextId](_speechly_d_.isegment.md#contextid)
* [entities](_speechly_d_.isegment.md#entities)
* [id](_speechly_d_.isegment.md#id)
* [intent](_speechly_d_.isegment.md#intent)
* [isFinal](_speechly_d_.isegment.md#isfinal)
* [words](_speechly_d_.isegment.md#words)

## Properties

###  contextId

• **contextId**: *string*

Defined in speechly.d.ts:218

The identifier of parent SLU context.

___

###  entities

• **entities**: *[IEntity](_speechly_d_.ientity.md)[]*

Defined in speechly.d.ts:238

All entities which belong to the segment, not ordered.

___

###  id

• **id**: *number*

Defined in speechly.d.ts:222

The identifier of the segment within the parent context.

___

###  intent

• **intent**: *[IIntent](_speechly_d_.iintent.md)*

Defined in speechly.d.ts:230

The intent of the segment.

___

###  isFinal

• **isFinal**: *boolean*

Defined in speechly.d.ts:226

Whether the segment is final. A final segment is guaranteed to only contain final parts.

___

###  words

• **words**: *[IWord](_speechly_d_.iword.md)[]*

Defined in speechly.d.ts:234

All words which belong to the segment, ordered by their indices.
