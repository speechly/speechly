[@speechly/react-client](../README.md) / [context](../modules/context.md) / SpeechProviderProps

# Interface: SpeechProviderProps

[context](../modules/context.md).SpeechProviderProps

Props for SpeechContext provider, which are used to initialise API client.

## Hierarchy

- `ClientOptions`

  ↳ **`SpeechProviderProps`**

## Table of contents

### Properties

- [disableTenative](context.SpeechProviderProps.md#disabletenative)
- [appId](context.SpeechProviderProps.md#appid)
- [projectId](context.SpeechProviderProps.md#projectid)
- [language](context.SpeechProviderProps.md#language)
- [loginUrl](context.SpeechProviderProps.md#loginurl)
- [apiUrl](context.SpeechProviderProps.md#apiurl)
- [sampleRate](context.SpeechProviderProps.md#samplerate)
- [debug](context.SpeechProviderProps.md#debug)
- [autoGainControl](context.SpeechProviderProps.md#autogaincontrol)
- [logSegments](context.SpeechProviderProps.md#logsegments)
- [microphone](context.SpeechProviderProps.md#microphone)
- [apiClient](context.SpeechProviderProps.md#apiclient)
- [storage](context.SpeechProviderProps.md#storage)

## Properties

### disableTenative

• `Optional` **disableTenative**: `boolean`

Whether to disable reacting to tentative items. Set this to true if you don't use them.

___

### appId

• `Optional` **appId**: `string`

The unique identifier of an app in the dashboard.

#### Inherited from

ClientOptions.appId

___

### projectId

• `Optional` **projectId**: `string`

The unique identifier of a project in the dashboard.

#### Inherited from

ClientOptions.projectId

___

### language

• `Optional` **language**: `string`

The language which is used by the app.

#### Inherited from

ClientOptions.language

___

### loginUrl

• `Optional` **loginUrl**: `string`

The URL of Speechly login endpoint.

#### Inherited from

ClientOptions.loginUrl

___

### apiUrl

• `Optional` **apiUrl**: `string`

The URL of Speechly SLU API endpoint.

#### Inherited from

ClientOptions.apiUrl

___

### sampleRate

• `Optional` **sampleRate**: `number`

The sample rate of the audio to use.

#### Inherited from

ClientOptions.sampleRate

___

### debug

• `Optional` **debug**: `boolean`

Whether to output debug statements to the console.

#### Inherited from

ClientOptions.debug

___

### autoGainControl

• `Optional` **autoGainControl**: `boolean`

Whether to use auto gain control.
True by default.

#### Inherited from

ClientOptions.autoGainControl

___

### logSegments

• `Optional` **logSegments**: `boolean`

Whether to output updated segments to the console.

#### Inherited from

ClientOptions.logSegments

___

### microphone

• `Optional` **microphone**: `Microphone`

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

#### Inherited from

ClientOptions.microphone

___

### apiClient

• `Optional` **apiClient**: `APIClient`

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

#### Inherited from

ClientOptions.apiClient

___

### storage

• `Optional` **storage**: `Storage`

Custom storage implementation.
If not provided, browser's LocalStorage API is used.

#### Inherited from

ClientOptions.storage
