[@speechly/react-client](../README.md) / [context](../modules/context.md) / SpeechContextState

# Interface: SpeechContextState

[context](../modules/context.md).SpeechContextState

The state of SpeechContext.

Functions to initialise audio and recording as well as the state are always present,
however the values returned from the API will only be present when they are returned from the API.

Individual values (transcripts, entities and intent) are reset back to undefined after current segment is finalised.

## Table of contents

### Methods

- [connect](context.SpeechContextState.md#connect)
- [attachMicrophone](context.SpeechContextState.md#attachmicrophone)
- [start](context.SpeechContextState.md#start)
- [stop](context.SpeechContextState.md#stop)

### Properties

- [listening](context.SpeechContextState.md#listening)
- [clientState](context.SpeechContextState.md#clientstate)
- [microphoneState](context.SpeechContextState.md#microphonestate)
- [appId](context.SpeechContextState.md#appid)
- [tentativeTranscript](context.SpeechContextState.md#tentativetranscript)
- [tentativeEntities](context.SpeechContextState.md#tentativeentities)
- [tentativeIntent](context.SpeechContextState.md#tentativeintent)
- [transcript](context.SpeechContextState.md#transcript)
- [entity](context.SpeechContextState.md#entity)
- [intent](context.SpeechContextState.md#intent)
- [segment](context.SpeechContextState.md#segment)
- [client](context.SpeechContextState.md#client)
- [microphone](context.SpeechContextState.md#microphone)

## Methods

### connect

▸ **connect**(): `Promise`<`void`\>

Connect to Speechly API.

#### Returns

`Promise`<`void`\>

___

### attachMicrophone

▸ **attachMicrophone**(): `Promise`<`void`\>

Function that initialises Speechly client, including both the API connection and the audio initialisation.

It is optional and you don't have to call it manually,
it will be called automatically upon the first call to toggleRecording.

The idea is that it provides a more fine-grained control over how the audio is initialised,
in case you want to give the user more control over your app.

#### Returns

`Promise`<`void`\>

___

### start

▸ **start**(): `Promise`<`string`\>

Turns listening on. Automatically initialises the API connection and audio stack. Returns the context id for the stated utterance.

#### Returns

`Promise`<`string`\>

___

### stop

▸ **stop**(): `Promise`<`string`\>

Turns listening off. Returns the context id for the stopped utterance.

#### Returns

`Promise`<`string`\>

## Properties

### listening

• **listening**: `boolean`

**`returns`** true if startContext called and listening will start.
Speechly will normally be listening nearly instantly after startContext.
Check clientState for details about browser client's state.

___

### clientState

• **clientState**: [`DecoderState`](../enums/index.DecoderState.md)

Current state of the context, whether it's idle, recording or failed, etc.
Use this to indicate to the user that recording is in progress or results are being fetched from the API.

___

### microphoneState

• **microphoneState**: [`AudioSourceState`](../enums/index.AudioSourceState.md)

Current state of the microphone

___

### appId

• `Optional` **appId**: `string`

Current appId in multi-app project.

___

### tentativeTranscript

• `Optional` **tentativeTranscript**: [`TentativeSpeechTranscript`](../modules/types.md#tentativespeechtranscript)

Last tentative transcript received from the API. Resets after current segment is finalised.

___

### tentativeEntities

• `Optional` **tentativeEntities**: [`TentativeSpeechEntities`](../modules/types.md#tentativespeechentities)

Last tentative entities received from the API. Resets after current segment is finalised.

___

### tentativeIntent

• `Optional` **tentativeIntent**: [`TentativeSpeechIntent`](../modules/types.md#tentativespeechintent)

Last tentative intent received from the API. Resets after current segment is finalised.

___

### transcript

• `Optional` **transcript**: [`SpeechTranscript`](../modules/types.md#speechtranscript)

Last final transcript received from the API. Resets after current segment is finalised.

___

### entity

• `Optional` **entity**: [`SpeechEntity`](../modules/types.md#speechentity)

Last final entity received from the API. Resets after current segment is finalised.

___

### intent

• `Optional` **intent**: [`SpeechIntent`](../modules/types.md#speechintent)

Last final intent received from the API. Resets after current segment is finalised.

___

### segment

• `Optional` **segment**: [`SpeechSegment`](index.SpeechSegment.md)

Last segment received from the API.

___

### client

• `Optional` **client**: `BrowserClient`

Low-level access to underlying Speechly BrowserClient.

___

### microphone

• `Optional` **microphone**: `BrowserMicrophone`

Low-level access to underlying Speechly BrowserMicrophone.
