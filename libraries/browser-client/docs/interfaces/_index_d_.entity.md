[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Entity](_index_d_.entity.md)

# Interface: Entity

A single entity detected by the SLU API.

## Hierarchy

* **Entity**

## Index

### Properties

* [endPosition](_index_d_.entity.md#endposition)
* [isFinal](_index_d_.entity.md#isfinal)
* [startPosition](_index_d_.entity.md#startposition)
* [type](_index_d_.entity.md#type)
* [value](_index_d_.entity.md#value)

## Properties

###  endPosition

• **endPosition**: *number*

Defined in index.d.ts:298

The index of the last word that contains this entity.

___

###  isFinal

• **isFinal**: *boolean*

Defined in index.d.ts:302

Whether the entity was detected as final.

___

###  startPosition

• **startPosition**: *number*

Defined in index.d.ts:294

The index of the first word that contains this entity.

___

###  type

• **type**: *string*

Defined in index.d.ts:286

The type specified by the developer in the NLU rules in the dashboard (e.g. restaurant_type).

___

###  value

• **value**: *string*

Defined in index.d.ts:290

The value of the entity (e.g. Papa Joe's).
