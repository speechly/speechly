[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [WebsocketResponse](_index_d_.websocketresponse.md)

# Interface: WebsocketResponse

The interface for response returned by WebSocket client.

## Hierarchy

* **WebsocketResponse**

## Index

### Properties

* [audio_context](_index_d_.websocketresponse.md#audio_context)
* [data](_index_d_.websocketresponse.md#data)
* [segment_id](_index_d_.websocketresponse.md#segment_id)
* [type](_index_d_.websocketresponse.md#type)

## Properties

###  audio_context

• **audio_context**: *string*

Defined in index.d.ts:607

Audio context ID.

___

###  data

• **data**: *[TranscriptResponse](_index_d_.transcriptresponse.md) | [EntityResponse](_index_d_.entityresponse.md) | [IntentResponse](_index_d_.intentresponse.md) | [TentativeTranscriptResponse](_index_d_.tentativetranscriptresponse.md) | [TentativeEntitiesResponse](_index_d_.tentativeentitiesresponse.md)*

Defined in index.d.ts:619

Response payload.

The payload value should match the response type (i.e. TranscriptResponse should have Transcript type).
Not all response types have payloads - Started, Stopped and SegmentEnd don't have payloads.
TentativeIntent and Intent share the same payload interface (IntentResponse).

___

###  segment_id

• **segment_id**: *number*

Defined in index.d.ts:611

Segment ID.

___

###  type

• **type**: *[WebsocketResponseType](../enums/_index_d_.websocketresponsetype.md)*

Defined in index.d.ts:603

Response type.
