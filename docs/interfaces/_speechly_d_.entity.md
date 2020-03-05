[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [Entity](_speechly_d_.entity.md)

# Interface: Entity

A single entity detected by the SLU API.

## Hierarchy

* **Entity**

## Index

### Properties

* [endPosition](_speechly_d_.entity.md#endposition)
* [isFinal](_speechly_d_.entity.md#isfinal)
* [startPosition](_speechly_d_.entity.md#startposition)
* [type](_speechly_d_.entity.md#type)
* [value](_speechly_d_.entity.md#value)

## Properties

###  endPosition

• **endPosition**: *number*

Defined in speechly.d.ts:207

The index of the last word that contains this entity.

___

###  isFinal

• **isFinal**: *boolean*

Defined in speechly.d.ts:211

Whether the entity was detected as final.

___

###  startPosition

• **startPosition**: *number*

Defined in speechly.d.ts:203

The index of the first word that contains this entity.

___

###  type

• **type**: *string*

Defined in speechly.d.ts:195

The type specified by the developer in the NLU rules in the dashboard (e.g. restaurant_type).

___

###  value

• **value**: *string*

Defined in speechly.d.ts:199

The value of the entity (e.g. Papa Joe's).
