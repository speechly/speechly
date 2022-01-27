[@speechly/react-client](../README.md) / [context](../modules/context.md) / SpeechContextState

# Interface: SpeechContextState

[context](../modules/context.md).SpeechContextState

The state of SpeechContext.

Functions to initialise audio and recording as well as the state are always present,
however the values returned from the API will only be present when they are returned from the API.

Individual values (transcripts, entities and intent) are reset back to undefined after current segment is finalised.

## Table of contents

### Properties

- [initialise](context.SpeechContextState.md#initialise)
- [toggleRecording](context.SpeechContextState.md#togglerecording)
- [startContext](context.SpeechContextState.md#startcontext)
- [stopContext](context.SpeechContextState.md#stopcontext)
- [clientState](context.SpeechContextState.md#clientstate)
- [speechState](context.SpeechContextState.md#speechstate)
- [appId](context.SpeechContextState.md#appid)
- [tentativeTranscript](context.SpeechContextState.md#tentativetranscript)
- [tentativeEntities](context.SpeechContextState.md#tentativeentities)
- [tentativeIntent](context.SpeechContextState.md#tentativeintent)
- [transcript](context.SpeechContextState.md#transcript)
- [entity](context.SpeechContextState.md#entity)
- [intent](context.SpeechContextState.md#intent)
- [segment](context.SpeechContextState.md#segment)

### Methods

- [switchApp](context.SpeechContextState.md#switchapp)

## Properties

### initialise

• **initialise**: [`ContextFunc`](../modules/context.md#contextfunc)

Function that initialises Speechly client, including both the API connection and the audio initialisation.

It is optional and you don't have to call it manually,
it will be called automatically upon the first call to toggleRecording.

The idea is that it provides a more fine-grained control over how the audio is initialised,
in case you want to give the user more control over your app.

___

### toggleRecording

• **toggleRecording**: [`ContextFunc`](../modules/context.md#contextfunc)

**`deprecated`**
Toggles listening on or off. Automatically initialises the API connection and audio stack.

___

### startContext

• **startContext**: [`ContextFunc`](../modules/context.md#contextfunc)

Turns listening on. Automatically initialises the API connection and audio stack.

___

### stopContext

• **stopContext**: [`ContextFunc`](../modules/context.md#contextfunc)

Turns listening off.

___

### clientState

• **clientState**: [`ClientState`](../enums/index.ClientState.md)

Current state of the context, whether it's idle, recording or failed, etc.
It's advised to react to this to enable / disable voice functionality in your app
as well as inidicate to the user that recording is in progress or results are being fetched from the API.

___

### speechState

• **speechState**: [`SpeechState`](../enums/types.SpeechState.md)

**`deprecated`**
Current state of the context, whether it's idle, recording or failed, etc.
It's advised to react to this to enable / disable voice functionality in your app
as well as inidicate to the user that recording is in progress or results are being fetched from the API.

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

## Methods

### switchApp

▸ **switchApp**(`appId`): `void`

Switch appId in multi-app project.

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId` | `string` |

#### Returns

`void`
