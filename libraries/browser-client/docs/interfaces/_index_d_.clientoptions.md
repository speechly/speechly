[@speechly/browser-client](../README.md) › ["index.d"](../modules/_index_d_.md) › [ClientOptions](_index_d_.clientoptions.md)

# Interface: ClientOptions

The options which can be used to configure the client.

## Hierarchy

* **ClientOptions**

## Index

### Properties

* [apiClient](_index_d_.clientoptions.md#optional-apiclient)
* [apiUrl](_index_d_.clientoptions.md#optional-apiurl)
* [appId](_index_d_.clientoptions.md#optional-appid)
* [debug](_index_d_.clientoptions.md#optional-debug)
* [language](_index_d_.clientoptions.md#optional-language)
* [logSegments](_index_d_.clientoptions.md#optional-logsegments)
* [loginUrl](_index_d_.clientoptions.md#optional-loginurl)
* [microphone](_index_d_.clientoptions.md#optional-microphone)
* [projectId](_index_d_.clientoptions.md#optional-projectid)
* [sampleRate](_index_d_.clientoptions.md#optional-samplerate)
* [storage](_index_d_.clientoptions.md#optional-storage)

## Properties

### `Optional` apiClient

• **apiClient**? : *[APIClient](_index_d_.apiclient.md)*

Defined in index.d.ts:237

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

___

### `Optional` apiUrl

• **apiUrl**? : *undefined | string*

Defined in index.d.ts:215

The URL of Speechly SLU API endpoint.

___

### `Optional` appId

• **appId**? : *undefined | string*

Defined in index.d.ts:199

The unique identifier of an app in the dashboard.

___

### `Optional` debug

• **debug**? : *undefined | false | true*

Defined in index.d.ts:223

Whether to output debug statements to the console.

___

### `Optional` language

• **language**? : *undefined | string*

Defined in index.d.ts:207

The language which is used by the app.

___

### `Optional` logSegments

• **logSegments**? : *undefined | false | true*

Defined in index.d.ts:227

Whether to output updated segments to the console.

___

### `Optional` loginUrl

• **loginUrl**? : *undefined | string*

Defined in index.d.ts:211

The URL of Speechly login endpoint.

___

### `Optional` microphone

• **microphone**? : *[Microphone](_index_d_.microphone.md)*

Defined in index.d.ts:232

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### `Optional` projectId

• **projectId**? : *undefined | string*

Defined in index.d.ts:203

The unique identifier of a project in the dashboard.

___

### `Optional` sampleRate

• **sampleRate**? : *undefined | number*

Defined in index.d.ts:219

The sample rate of the audio to use.

___

### `Optional` storage

• **storage**? : *Storage_2*

Defined in index.d.ts:242

Custom storage implementation.
If not provided, browser's LocalStorage API is used.
