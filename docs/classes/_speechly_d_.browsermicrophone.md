[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [BrowserMicrophone](_speechly_d_.browsermicrophone.md)

# Class: BrowserMicrophone

Microphone implementation for the browser. Uses getUserMedia and Web Audio API.

## Hierarchy

* **BrowserMicrophone**

## Implements

* [Microphone](../interfaces/_speechly_d_.microphone.md)

## Index

### Constructors

* [constructor](_speechly_d_.browsermicrophone.md#constructor)

### Methods

* [close](_speechly_d_.browsermicrophone.md#close)
* [initialize](_speechly_d_.browsermicrophone.md#initialize)
* [mute](_speechly_d_.browsermicrophone.md#mute)
* [onAudio](_speechly_d_.browsermicrophone.md#onaudio)
* [unmute](_speechly_d_.browsermicrophone.md#unmute)

## Constructors

###  constructor

\+ **new BrowserMicrophone**(`sampleRate`: number): *[BrowserMicrophone](_speechly_d_.browsermicrophone.md)*

Defined in speechly.d.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`sampleRate` | number |

**Returns:** *[BrowserMicrophone](_speechly_d_.browsermicrophone.md)*

## Methods

###  close

▸ **close**(`cb`: [ErrorCallback](../modules/_speechly_d_.md#errorcallback)): *void*

*Implementation of [Microphone](../interfaces/_speechly_d_.microphone.md)*

Defined in speechly.d.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [ErrorCallback](../modules/_speechly_d_.md#errorcallback) |

**Returns:** *void*

___

###  initialize

▸ **initialize**(`cb`: [ErrorCallback](../modules/_speechly_d_.md#errorcallback)): *void*

*Implementation of [Microphone](../interfaces/_speechly_d_.microphone.md)*

Defined in speechly.d.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [ErrorCallback](../modules/_speechly_d_.md#errorcallback) |

**Returns:** *void*

___

###  mute

▸ **mute**(): *void*

*Implementation of [Microphone](../interfaces/_speechly_d_.microphone.md)*

Defined in speechly.d.ts:24

**Returns:** *void*

___

###  onAudio

▸ **onAudio**(`cb`: [AudioCallback](../modules/_speechly_d_.md#audiocallback)): *void*

*Implementation of [Microphone](../interfaces/_speechly_d_.microphone.md)*

Defined in speechly.d.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`cb` | [AudioCallback](../modules/_speechly_d_.md#audiocallback) |

**Returns:** *void*

___

###  unmute

▸ **unmute**(): *void*

*Implementation of [Microphone](../interfaces/_speechly_d_.microphone.md)*

Defined in speechly.d.ts:25

**Returns:** *void*
