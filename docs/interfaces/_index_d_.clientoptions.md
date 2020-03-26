[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientOptions](_index_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [appId](_index_d_.clientoptions.md#appid)
* [debug](_index_d_.clientoptions.md#optional-debug)
* [deviceId](_index_d_.clientoptions.md#deviceid)
* [language](_index_d_.clientoptions.md#language)
* [microphone](_index_d_.clientoptions.md#optional-microphone)
* [sampleRate](_index_d_.clientoptions.md#optional-samplerate)
* [url](_index_d_.clientoptions.md#optional-url)

## Properties

###  appId

• **appId**: *string*

Defined in index.d.ts:127

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in index.d.ts:150

Whether to output debug statements to the console.

___

###  deviceId

• **deviceId**: *string*

Defined in index.d.ts:138

The identifier of the device which is using the client.
It is suggested that the ID is in UUID v4 format and additionally, it should be persistent,
since there are latency optimisations, which work for consecutive device sessions.
One of options to store the ID is using browser's local storage.

___

###  language

• **language**: *string*

Defined in index.d.ts:131

The language which is used by the app.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_index_d_.microphone.md)*

Defined in index.d.ts:154

Microphone instance.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in index.d.ts:146

The sample rate of the audio to use.

___

### `Optional` url

• **url**? : *undefined | string*

Defined in index.d.ts:142

The URL of Speechly API endpoint.
