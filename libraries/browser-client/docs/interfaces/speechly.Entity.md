[@speechly/browser-client](../README.md) / [speechly](../modules/speechly.md) / Entity

# Interface: Entity

[speechly](../modules/speechly.md).Entity

A single entity detected by the SLU API.

## Table of contents

### Properties

- [type](speechly.Entity.md#type)
- [value](speechly.Entity.md#value)
- [startPosition](speechly.Entity.md#startposition)
- [endPosition](speechly.Entity.md#endposition)
- [isFinal](speechly.Entity.md#isfinal)

## Properties

### type

• **type**: `string`

The type specified by the developer in the NLU rules in the dashboard (e.g. restaurant_type).

___

### value

• **value**: `string`

The value of the entity (e.g. Papa Joe's).

___

### startPosition

• **startPosition**: `number`

The index of the first word that contains this entity.

___

### endPosition

• **endPosition**: `number`

The index of the last word that contains this entity.

___

### isFinal

• **isFinal**: `boolean`

Whether the entity was detected as final.
