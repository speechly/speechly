[@speechly/browser-client](../README.md) › ["speechly.d"](../modules/_speechly_d_.md) › [ClientOptions](_speechly_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [appId](_speechly_d_.clientoptions.md#appid)
* [debug](_speechly_d_.clientoptions.md#optional-debug)
* [deviceId](_speechly_d_.clientoptions.md#optional-deviceid)
* [language](_speechly_d_.clientoptions.md#language)
* [microphone](_speechly_d_.clientoptions.md#optional-microphone)
* [sampleRate](_speechly_d_.clientoptions.md#optional-samplerate)
* [url](_speechly_d_.clientoptions.md#optional-url)

## Properties

###  appId

• **appId**: *string*

Defined in speechly.d.ts:127

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in speechly.d.ts:147

Whether to output debug statements to the console.

___

### `Optional` deviceId

• **deviceId**? : *undefined | string*

Defined in speechly.d.ts:139

The identifier of the device which is using the client.

___

###  language

• **language**: *string*

Defined in speechly.d.ts:131

The language which is used by the app.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_speechly_d_.microphone.md)*

Defined in speechly.d.ts:151

Microphone instance.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in speechly.d.ts:143

The sample rate of the audio to use.

___

### `Optional` url

• **url**? : *undefined | string*

Defined in speechly.d.ts:135

The URL of Speechly API endpoint.
