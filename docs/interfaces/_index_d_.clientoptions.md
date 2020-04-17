[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientOptions](_index_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [apiClient](_index_d_.clientoptions.md#optional-apiclient)
* [appId](_index_d_.clientoptions.md#appid)
* [debug](_index_d_.clientoptions.md#optional-debug)
* [language](_index_d_.clientoptions.md#language)
* [microphone](_index_d_.clientoptions.md#optional-microphone)
* [sampleRate](_index_d_.clientoptions.md#optional-samplerate)
* [storage](_index_d_.clientoptions.md#optional-storage)
* [url](_index_d_.clientoptions.md#optional-url)

## Properties

### `Optional` apiClient

• **apiClient**? : *[APIClient](_index_d_.apiclient.md)*

Defined in index.d.ts:201

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

___

###  appId

• **appId**: *string*

Defined in index.d.ts:175

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in index.d.ts:191

Whether to output debug statements to the console.

___

###  language

• **language**: *string*

Defined in index.d.ts:179

The language which is used by the app.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_index_d_.microphone.md)*

Defined in index.d.ts:196

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in index.d.ts:187

The sample rate of the audio to use.

___

### `Optional` storage

• **storage**? : *[Storage](_index_d_.storage.md)*

Defined in index.d.ts:206

Custom storage implementation.
If not provided, browser's LocalStorage API is used.

___

### `Optional` url

• **url**? : *undefined | string*

Defined in index.d.ts:183

The URL of Speechly API endpoint.
