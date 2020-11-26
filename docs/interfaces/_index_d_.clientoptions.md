[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientOptions](_index_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [apiClient](_index_d_.clientoptions.md#optional-apiclient)
* [apiUrl](_index_d_.clientoptions.md#optional-apiurl)
* [appId](_index_d_.clientoptions.md#appid)
* [debug](_index_d_.clientoptions.md#optional-debug)
* [language](_index_d_.clientoptions.md#language)
* [loginUrl](_index_d_.clientoptions.md#optional-loginurl)
* [microphone](_index_d_.clientoptions.md#optional-microphone)
* [sampleRate](_index_d_.clientoptions.md#optional-samplerate)
* [storage](_index_d_.clientoptions.md#optional-storage)

## Properties

### `Optional` apiClient

• **apiClient**? : *[APIClient](_index_d_.apiclient.md)*

Defined in index.d.ts:202

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

___

### `Optional` apiUrl

• **apiUrl**? : *undefined | string*

Defined in index.d.ts:184

The URL of Speechly SLU API endpoint.

___

###  appId

• **appId**: *string*

Defined in index.d.ts:172

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in index.d.ts:192

Whether to output debug statements to the console.

___

###  `Optional` language

• **language**?: *undefined | string*

Defined in index.d.ts:176

The language which is used by the app.

___

### `Optional` loginUrl

• **loginUrl**? : *undefined | string*

Defined in index.d.ts:180

The URL of Speechly login endpoint.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_index_d_.microphone.md)*

Defined in index.d.ts:197

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in index.d.ts:188

The sample rate of the audio to use.

___

### `Optional` storage

• **storage**? : *Storage_2*

Defined in index.d.ts:207

Custom storage implementation.
If not provided, browser's LocalStorage API is used.
