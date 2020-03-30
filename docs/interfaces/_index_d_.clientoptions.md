[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientOptions](_index_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [appId](_index_d_.clientoptions.md#appid)
* [debug](_index_d_.clientoptions.md#optional-debug)
* [language](_index_d_.clientoptions.md#language)
* [microphone](_index_d_.clientoptions.md#optional-microphone)
* [sampleRate](_index_d_.clientoptions.md#optional-samplerate)
* [storage](_index_d_.clientoptions.md#optional-storage)
* [url](_index_d_.clientoptions.md#optional-url)

## Properties

###  appId

• **appId**: *string*

Defined in index.d.ts:115

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in index.d.ts:131

Whether to output debug statements to the console.

___

###  language

• **language**: *string*

Defined in index.d.ts:119

The language which is used by the app.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_index_d_.microphone.md)*

Defined in index.d.ts:136

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in index.d.ts:127

The sample rate of the audio to use.

___

### `Optional` storage

• **storage**? : *[Storage](_index_d_.storage.md)*

Defined in index.d.ts:141

Custom storage implementation.
If not provided, browser's LocalStorage API is used.

___

### `Optional` url

• **url**? : *undefined | string*

Defined in index.d.ts:123

The URL of Speechly API endpoint.
