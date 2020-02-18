[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [IEntity](_speechly_d_.ientity.md)

# Interface: IEntity

A single entity detected by the SLU API.

## Hierarchy

* **IEntity**

## Index

### Properties

* [endPosition](_speechly_d_.ientity.md#endposition)
* [isFinal](_speechly_d_.ientity.md#isfinal)
* [startPosition](_speechly_d_.ientity.md#startposition)
* [type](_speechly_d_.ientity.md#type)
* [value](_speechly_d_.ientity.md#value)

## Properties

###  endPosition

• **endPosition**: *number*

Defined in speechly.d.ts:182

The index of the last word that contains this entity.

___

###  isFinal

• **isFinal**: *boolean*

Defined in speechly.d.ts:186

Whether the entity was detected as final.

___

###  startPosition

• **startPosition**: *number*

Defined in speechly.d.ts:178

The index of the first word that contains this entity.

___

###  type

• **type**: *string*

Defined in speechly.d.ts:170

The type specified by the developer in the NLU rules in the dashboard (e.g. restaurant_type).

___

###  value

• **value**: *string*

Defined in speechly.d.ts:174

The value of the entity (e.g. Papa Joe's).
