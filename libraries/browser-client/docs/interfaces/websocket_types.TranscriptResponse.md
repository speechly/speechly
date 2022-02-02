[@speechly/browser-client](../README.md) / [websocket/types](../modules/websocket_types.md) / TranscriptResponse

# Interface: TranscriptResponse

[websocket/types](../modules/websocket_types.md).TranscriptResponse

Transcript response payload.

## Table of contents

### Properties

- [word](websocket_types.TranscriptResponse.md#word)
- [index](websocket_types.TranscriptResponse.md#index)
- [start\_timestamp](websocket_types.TranscriptResponse.md#start_timestamp)
- [end\_timestamp](websocket_types.TranscriptResponse.md#end_timestamp)

## Properties

### word

• **word**: `string`

Transcripted word.

___

### index

• **index**: `number`

The index of the transcripted word in the segment.

___

### start\_timestamp

• **start\_timestamp**: `number`

Start timestamp of the transcript in the audio stream in milliseconds.

___

### end\_timestamp

• **end\_timestamp**: `number`

End timestamp of the transcript in the audio stream in milliseconds.
