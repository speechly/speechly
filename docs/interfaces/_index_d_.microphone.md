[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [Microphone](_index_d_.microphone.md)

# Interface: Microphone

The interface for a microphone.

## Hierarchy

* **Microphone**

## Index

### Methods

* [close](_index_d_.microphone.md#close)
* [initialize](_index_d_.microphone.md#initialize)
* [mute](_index_d_.microphone.md#mute)
* [onAudio](_index_d_.microphone.md#onaudio)
* [unmute](_index_d_.microphone.md#unmute)

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in index.d.ts:382

Closes the microphone, tearing down all the infrastructure.

The microphone should stop emitting audio after this is called.
Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
This method will be called by the Client as part of client closure process.

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(): *Promise‹void›*

Defined in index.d.ts:374

Initialises the microphone.

This should prepare the microphone infrastructure for receiving audio chunks,
but the microphone should remain muted after the call.
This method will be called by the Client as part of client initialisation process.

**Returns:** *Promise‹void›*

___

###  mute

▸ **mute**(): *void*

Defined in index.d.ts:386

Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.

**Returns:** *void*

___

###  onAudio

▸ **onAudio**(`cb`: [AudioCallback](../modules/_index_d_.md#audiocallback)): *void*

Defined in index.d.ts:366

Registers the callback that is invoked whenever an audio chunk is emitted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [AudioCallback](../modules/_index_d_.md#audiocallback) | the callback to invoke.  |

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in index.d.ts:390

Unmutes the microphone.

**Returns:** *void*
