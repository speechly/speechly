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
* [unmute](_index_d_.microphone.md#unmute)

## Methods

###  close

▸ **close**(): *Promise‹void›*

Defined in index.d.ts:424

Closes the microphone, tearing down all the infrastructure.

The microphone should stop emitting audio after this is called.
Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
This method will be called by the Client as part of client closure process.

**Returns:** *Promise‹void›*

___

###  initialize

▸ **initialize**(`audioContext`: AudioContext, `opts`: MediaStreamConstraints): *Promise‹void›*

Defined in index.d.ts:416

Initialises the microphone.

This should prepare the microphone infrastructure for receiving audio chunks,
but the microphone should remain muted after the call.
This method will be called by the Client as part of client initialisation process.

**Parameters:**

Name | Type |
------ | ------ |
`audioContext` | AudioContext |
`opts` | MediaStreamConstraints |

**Returns:** *Promise‹void›*

___

###  mute

▸ **mute**(): *void*

Defined in index.d.ts:428

Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in index.d.ts:432

Unmutes the microphone.

**Returns:** *void*
