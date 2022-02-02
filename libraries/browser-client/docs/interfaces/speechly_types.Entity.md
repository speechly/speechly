[@speechly/browser-client](../README.md) / [speechly/types](../modules/speechly_types.md) / Entity

# Interface: Entity

[speechly/types](../modules/speechly_types.md).Entity

A single entity detected by the SLU API.

## Table of contents

### Properties

- [type](speechly_types.Entity.md#type)
- [value](speechly_types.Entity.md#value)
- [startPosition](speechly_types.Entity.md#startposition)
- [endPosition](speechly_types.Entity.md#endposition)
- [isFinal](speechly_types.Entity.md#isfinal)

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
