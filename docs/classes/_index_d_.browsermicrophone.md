[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [BrowserMicrophone](_index_d_.browsermicrophone.md)

# Class: BrowserMicrophone

Microphone implementation for the browser. Uses getUserMedia and Web Audio API.

## Hierarchy

* **BrowserMicrophone**

## Implements

* [Microphone](../interfaces/_index_d_.microphone.md)

## Index

### Constructors

* [constructor](_index_d_.browsermicrophone.md#constructor)

### Methods

* [close](_index_d_.browsermicrophone.md#close)
* [initialize](_index_d_.browsermicrophone.md#initialize)
* [mute](_index_d_.browsermicrophone.md#mute)
* [onAudio](_index_d_.browsermicrophone.md#onaudio)
* [unmute](_index_d_.browsermicrophone.md#unmute)

## Constructors

###  constructor

\+ **new BrowserMicrophone**(`sampleRate`: number): *[BrowserMicrophone](_index_d_.browsermicrophone.md)*

Defined in index.d.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`sampleRate` | number |

**Returns:** *[BrowserMicrophone](_index_d_.browsermicrophone.md)*

## Methods

###  close

▸ **close**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

*Implementation of [Microphone](../interfaces/_index_d_.microphone.md)*

Defined in index.d.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) |

**Returns:** *void*

___

###  initialize

▸ **initialize**(`cb`: [ErrorCallback](../modules/_index_d_.md#errorcallback)): *void*

*Implementation of [Microphone](../interfaces/_index_d_.microphone.md)*

Defined in index.d.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [ErrorCallback](../modules/_index_d_.md#errorcallback) |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

*Implementation of [Microphone](../interfaces/_index_d_.microphone.md)*

Defined in index.d.ts:24

**Returns:** *void*

___

###  onAudio

▸ **onAudio**(`cb`: [AudioCallback](../modules/_index_d_.md#audiocallback)): *void*

*Implementation of [Microphone](../interfaces/_index_d_.microphone.md)*

Defined in index.d.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [AudioCallback](../modules/_index_d_.md#audiocallback) |

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

*Implementation of [Microphone](../interfaces/_index_d_.microphone.md)*

Defined in index.d.ts:25

**Returns:** *void*
