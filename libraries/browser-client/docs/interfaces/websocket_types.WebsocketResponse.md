[@speechly/browser-client](../README.md) / [websocket/types](../modules/websocket_types.md) / WebsocketResponse

# Interface: WebsocketResponse

[websocket/types](../modules/websocket_types.md).WebsocketResponse

The interface for response returned by WebSocket client.

## Table of contents

### Properties

- [type](websocket_types.WebsocketResponse.md#type)
- [audio\_context](websocket_types.WebsocketResponse.md#audio_context)
- [segment\_id](websocket_types.WebsocketResponse.md#segment_id)
- [data](websocket_types.WebsocketResponse.md#data)

## Properties

### type

• **type**: [`WebsocketResponseType`](../enums/websocket_types.WebsocketResponseType.md)

Response type.

___

### audio\_context

• **audio\_context**: `string`

Audio context ID.

___

### segment\_id

• **segment\_id**: `number`

Segment ID.

___

### data

• **data**: [`TentativeTranscriptResponse`](websocket_types.TentativeTranscriptResponse.md) \| [`TranscriptResponse`](websocket_types.TranscriptResponse.md) \| [`TentativeEntitiesResponse`](websocket_types.TentativeEntitiesResponse.md) \| [`EntityResponse`](websocket_types.EntityResponse.md) \| [`IntentResponse`](websocket_types.IntentResponse.md)

Response payload.

The payload value should match the response type (i.e. TranscriptResponse should have Transcript type).
Not all response types have payloads - Started, Stopped and SegmentEnd don't have payloads.
TentativeIntent and Intent share the same payload interface (IntentResponse).
