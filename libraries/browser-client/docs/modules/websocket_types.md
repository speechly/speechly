[@speechly/browser-client](../README.md) / websocket/types

# Module: websocket/types

## Table of contents

### Interfaces

- [WebsocketResponse](../interfaces/websocket_types.WebsocketResponse.md)
- [TranscriptResponse](../interfaces/websocket_types.TranscriptResponse.md)
- [EntityResponse](../interfaces/websocket_types.EntityResponse.md)
- [IntentResponse](../interfaces/websocket_types.IntentResponse.md)
- [TentativeTranscriptResponse](../interfaces/websocket_types.TentativeTranscriptResponse.md)
- [TentativeEntitiesResponse](../interfaces/websocket_types.TentativeEntitiesResponse.md)
- [APIClient](../interfaces/websocket_types.APIClient.md)

### Enumerations

- [WebsocketResponseType](../enums/websocket_types.WebsocketResponseType.md)

### Type aliases

- [ResponseCallback](websocket_types.md#responsecallback)
- [CloseCallback](websocket_types.md#closecallback)

## Type aliases

### ResponseCallback

Ƭ **ResponseCallback**: (`response`: [`WebsocketResponse`](../interfaces/websocket_types.WebsocketResponse.md)) => `void`

#### Type declaration

▸ (`response`): `void`

A callback that is invoked whenever a response is received from Speechly SLU WebSocket API.

##### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`WebsocketResponse`](../interfaces/websocket_types.WebsocketResponse.md) |

##### Returns

`void`

___

### CloseCallback

Ƭ **CloseCallback**: (`err`: `Error`) => `void`

#### Type declaration

▸ (`err`): `void`

A callback that is invoked whenever WebSocket connection is closed.

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |

##### Returns

`void`
