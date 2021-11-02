**[@speechly/react-client](../README.md)**

> [Globals](../README.md) / ["index.d"](../modules/_index_d_.md) / SpeechContextState

# Interface: SpeechContextState

The state of SpeechContext.

Functions to initialise audio and recording as well as the state are always present,
however the values returned from the API will only be present when they are returned from the API.

Individual values (transcripts, entities and intent) are reset back to undefined after current segment is finalised.

## Hierarchy

* **SpeechContextState**

## Index

### Properties

* [entity](_index_d_.speechcontextstate.md#entity)
* [initialise](_index_d_.speechcontextstate.md#initialise)
* [intent](_index_d_.speechcontextstate.md#intent)
* [segment](_index_d_.speechcontextstate.md#segment)
* [speechState](_index_d_.speechcontextstate.md#speechstate)
* [tentativeEntities](_index_d_.speechcontextstate.md#tentativeentities)
* [tentativeIntent](_index_d_.speechcontextstate.md#tentativeintent)
* [tentativeTranscript](_index_d_.speechcontextstate.md#tentativetranscript)
* [toggleRecording](_index_d_.speechcontextstate.md#togglerecording)
* [transcript](_index_d_.speechcontextstate.md#transcript)

## Properties

### entity

• `Optional` **entity**: [SpeechEntity](../modules/_index_d_.md#speechentity)

*Defined in dist/index.d.ts:73*

Last final entity received from the API. Resets after current segment is finalised.

___

### initialise

•  **initialise**: [ContextFunc](../modules/_index_d_.md#contextfunc)

*Defined in dist/index.d.ts:43*

Function that initialises Speechly client, including both the API connection and the audio initialisation.

It is optional and you don't have to call it manually,
it will be called automatically upon the first call to toggleRecording.

The idea is that it provides a more fine-grained control over how the audio is initialised,
in case you want to give the user more control over your app.

___

### intent

• `Optional` **intent**: [SpeechIntent](../modules/_index_d_.md#speechintent)

*Defined in dist/index.d.ts:77*

Last final intent received from the API. Resets after current segment is finalised.

___

### segment

• `Optional` **segment**: SpeechSegment

*Defined in dist/index.d.ts:81*

Last segment received from the API.

___

### speechState

•  **speechState**: [SpeechState](../enums/_index_d_.speechstate.md)

*Defined in dist/index.d.ts:53*

Current state of the context, whether it's idle, recording or failed, etc.
It's advised to react to this to enable / disable voice functionality in your app
as well as inidicate to the user that recording is in progress or results are being fetched from the API.

___

### tentativeEntities

• `Optional` **tentativeEntities**: [TentativeSpeechEntities](../modules/_index_d_.md#tentativespeechentities)

*Defined in dist/index.d.ts:61*

Last tentative entities received from the API. Resets after current segment is finalised.

___

### tentativeIntent

• `Optional` **tentativeIntent**: [TentativeSpeechIntent](../modules/_index_d_.md#tentativespeechintent)

*Defined in dist/index.d.ts:65*

Last tentative intent received from the API. Resets after current segment is finalised.

___

### tentativeTranscript

• `Optional` **tentativeTranscript**: [TentativeSpeechTranscript](../modules/_index_d_.md#tentativespeechtranscript)

*Defined in dist/index.d.ts:57*

Last tentative transcript received from the API. Resets after current segment is finalised.

___

### toggleRecording

•  **toggleRecording**: [ContextFunc](../modules/_index_d_.md#contextfunc)

*Defined in dist/index.d.ts:47*

Toggles recording on or off. Automatically initialises the API connection and audio stack.

___

### transcript

• `Optional` **transcript**: [SpeechTranscript](../modules/_index_d_.md#speechtranscript)

*Defined in dist/index.d.ts:69*

Last final transcript received from the API. Resets after current segment is finalised.
