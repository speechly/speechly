[@speechly/browser-client](../README.md) / [websocket/types](../modules/websocket_types.md) / EntityResponse

# Interface: EntityResponse

[websocket/types](../modules/websocket_types.md).EntityResponse

Entity response payload.

## Table of contents

### Properties

- [entity](websocket_types.EntityResponse.md#entity)
- [value](websocket_types.EntityResponse.md#value)
- [start\_position](websocket_types.EntityResponse.md#start_position)
- [end\_position](websocket_types.EntityResponse.md#end_position)

## Properties

### entity

• **entity**: `string`

Entity type (e.g. restaurant, direction, room, device).

___

### value

• **value**: `string`

Entity value (e.g. "sushi bar", "northwest", "living room", "kitchen lights").

___

### start\_position

• **start\_position**: `number`

Start position of the entity in the segment. Correlates with TranscriptResponse indices.
Inclusive.

___

### end\_position

• **end\_position**: `number`

End position of the entity in the segment. Correlates with TranscriptResponse indices.
Exclusive.
