[@speechly/react-client](../README.md) / [index](../modules/index.md) / Entity

# Interface: Entity

[index](../modules/index.md).Entity

A single entity detected by the SLU API.

## Table of contents

### Properties

- [type](index.Entity.md#type)
- [value](index.Entity.md#value)
- [startPosition](index.Entity.md#startposition)
- [endPosition](index.Entity.md#endposition)
- [isFinal](index.Entity.md#isfinal)

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
