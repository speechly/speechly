**[@speechly/react-client](../README.md)**

> [Globals](../README.md) / ["index.d"](../modules/_index_d_.md) / SpeechProviderProps

# Interface: SpeechProviderProps

Props for SpeechContext provider, which are used to initialise API client.

## Hierarchy

* ClientOptions

  ↳ **SpeechProviderProps**

## Index

### Properties

* [apiClient](_index_d_.speechproviderprops.md#apiclient)
* [apiUrl](_index_d_.speechproviderprops.md#apiurl)
* [appId](_index_d_.speechproviderprops.md#appid)
* [debug](_index_d_.speechproviderprops.md#debug)
* [disableTenative](_index_d_.speechproviderprops.md#disabletenative)
* [language](_index_d_.speechproviderprops.md#language)
* [loginUrl](_index_d_.speechproviderprops.md#loginurl)
* [microphone](_index_d_.speechproviderprops.md#microphone)
* [sampleRate](_index_d_.speechproviderprops.md#samplerate)
* [storage](_index_d_.speechproviderprops.md#storage)

## Properties

### apiClient

• `Optional` **apiClient**: APIClient

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[apiClient](_index_d_.speechproviderprops.md#apiclient)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:207*

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

___

### apiUrl

• `Optional` **apiUrl**: undefined \| string

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[apiUrl](_index_d_.speechproviderprops.md#apiurl)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:189*

The URL of Speechly SLU API endpoint.

___

### appId

•  **appId**: string

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[appId](_index_d_.speechproviderprops.md#appid)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:177*

The unique identifier of an app in the dashboard.

___

### debug

• `Optional` **debug**: undefined \| false \| true

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[debug](_index_d_.speechproviderprops.md#debug)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:197*

Whether to output debug statements to the console.

___

### disableTenative

• `Optional` **disableTenative**: undefined \| false \| true

*Defined in dist/index.d.ts:140*

Whether to disable reacting to tentative items. Set this to true if you don't use them.

___

### language

• `Optional` **language**: undefined \| string

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[language](_index_d_.speechproviderprops.md#language)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:181*

The language which is used by the app.

___

### loginUrl

• `Optional` **loginUrl**: undefined \| string

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[loginUrl](_index_d_.speechproviderprops.md#loginurl)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:185*

The URL of Speechly login endpoint.

___

### microphone

• `Optional` **microphone**: Microphone

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[microphone](_index_d_.speechproviderprops.md#microphone)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:202*

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### sampleRate

• `Optional` **sampleRate**: undefined \| number

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[sampleRate](_index_d_.speechproviderprops.md#samplerate)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:193*

The sample rate of the audio to use.

___

### storage

• `Optional` **storage**: Storage_2

*Inherited from [SpeechProviderProps](_index_d_.speechproviderprops.md).[storage](_index_d_.speechproviderprops.md#storage)*

*Defined in node_modules/@speechly/browser-client/index.d.ts:212*

Custom storage implementation.
If not provided, browser's LocalStorage API is used.
