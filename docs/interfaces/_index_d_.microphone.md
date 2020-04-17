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

▸ **close**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:411

Closes the microphone, tearing down all the infrastructure.

The microphone should stop emitting audio after this is called.
Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
This method will be called by the Client as part of client closure process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback that should be invoked after the closure process is completed (either successfully or with an error).  |

**Returns:** *void*

___

###  initialize

▸ **initialize**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

Defined in index.d.ts:400

Initialises the microphone.

This should prepare the microphone infrastructure for receiving audio chunks,
but the microphone should remain muted after the call.
This method will be called by the Client as part of client initialisation process.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) | the callback that is invoked after initialisation is completed (either successfully or with an error).  |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

Defined in index.d.ts:415

Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.

**Returns:** *void*

___

###  onAudio

▸ **onAudio**(`cb`: [AudioCallback](../modules/_index_d_.md#audiocallback)): *void*

Defined in index.d.ts:390

Registers the callback that is invoked whenever an audio chunk is emitted.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`cb` | [AudioCallback](../modules/_index_d_.md#audiocallback) | the callback to invoke.  |

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

Defined in index.d.ts:419

Unmutes the microphone.

**Returns:** *void*
