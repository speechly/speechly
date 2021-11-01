[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [EntityResponse](_index_d_.entityresponse.md)

# Interface: EntityResponse

Entity response payload.

## Hierarchy

* **EntityResponse**

## Index

### Properties

* [end_position](_index_d_.entityresponse.md#end_position)
* [entity](_index_d_.entityresponse.md#entity)
* [start_position](_index_d_.entityresponse.md#start_position)
* [value](_index_d_.entityresponse.md#value)

## Properties

###  end_position

• **end_position**: *number*

Defined in index.d.ts:333

End position of the entity in the segment. Correlates with TranscriptResponse indices.
Exclusive.

___

###  entity

• **entity**: *string*

Defined in index.d.ts:319

Entity type (e.g. restaurant, direction, room, device).

___

###  start_position

• **start_position**: *number*

Defined in index.d.ts:328

Start position of the entity in the segment. Correlates with TranscriptResponse indices.
Inclusive.

___

###  value

• **value**: *string*

Defined in index.d.ts:323

Entity value (e.g. "sushi bar", "northwest", "living room", "kitchen lights").
