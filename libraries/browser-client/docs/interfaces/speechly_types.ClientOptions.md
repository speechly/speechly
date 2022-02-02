[@speechly/browser-client](../README.md) / [speechly/types](../modules/speechly_types.md) / ClientOptions

# Interface: ClientOptions

[speechly/types](../modules/speechly_types.md).ClientOptions

The options which can be used to configure the client.

## Table of contents

### Properties

- [appId](speechly_types.ClientOptions.md#appid)
- [projectId](speechly_types.ClientOptions.md#projectid)
- [language](speechly_types.ClientOptions.md#language)
- [loginUrl](speechly_types.ClientOptions.md#loginurl)
- [apiUrl](speechly_types.ClientOptions.md#apiurl)
- [sampleRate](speechly_types.ClientOptions.md#samplerate)
- [debug](speechly_types.ClientOptions.md#debug)
- [autoGainControl](speechly_types.ClientOptions.md#autogaincontrol)
- [logSegments](speechly_types.ClientOptions.md#logsegments)
- [microphone](speechly_types.ClientOptions.md#microphone)
- [apiClient](speechly_types.ClientOptions.md#apiclient)
- [storage](speechly_types.ClientOptions.md#storage)

## Properties

### appId

• `Optional` **appId**: `string`

The unique identifier of an app in the dashboard.

___

### projectId

• `Optional` **projectId**: `string`

The unique identifier of a project in the dashboard.

___

### language

• `Optional` **language**: `string`

The language which is used by the app.

___

### loginUrl

• `Optional` **loginUrl**: `string`

The URL of Speechly login endpoint.

___

### apiUrl

• `Optional` **apiUrl**: `string`

The URL of Speechly SLU API endpoint.

___

### sampleRate

• `Optional` **sampleRate**: `number`

The sample rate of the audio to use.

___

### debug

• `Optional` **debug**: `boolean`

Whether to output debug statements to the console.

___

### autoGainControl

• `Optional` **autoGainControl**: `boolean`

Whether to use auto gain control.
True by default.

___

### logSegments

• `Optional` **logSegments**: `boolean`

Whether to output updated segments to the console.

___

### microphone

• `Optional` **microphone**: [`Microphone`](microphone_types.Microphone.md)

Custom microphone implementation.
If not provided, an implementation based on getUserMedia and Web Audio API is used.

___

### apiClient

• `Optional` **apiClient**: [`APIClient`](websocket_types.APIClient.md)

Custom API client implementation.
If not provided, an implementation based on Speechly SLU WebSocket API is used.

___

### storage

• `Optional` **storage**: [`Storage`](storage_types.Storage.md)

Custom storage implementation.
If not provided, browser's LocalStorage API is used.
