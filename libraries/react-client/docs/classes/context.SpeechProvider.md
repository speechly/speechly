[@speechly/react-client](../README.md) / [context](../modules/context.md) / SpeechProvider

# Class: SpeechProvider

[context](../modules/context.md).SpeechProvider

The provider for SpeechContext.

Make sure you have only one SpeechProvider in your application,
because otherwise the audio will be mixed up and unusable.

It is possible to switch the props on the fly, which will make provider stop current client if it's running
and start a new one.

## Hierarchy

- `Component`<[`SpeechProviderProps`](../interfaces/context.SpeechProviderProps.md), `SpeechProviderState`\>

  ↳ **`SpeechProvider`**

## Table of contents

### Constructors

- [constructor](context.SpeechProvider.md#constructor)

### Methods

- [componentDidMount](context.SpeechProvider.md#componentdidmount)
- [initialiseAudio](context.SpeechProvider.md#initialiseaudio)
- [startContext](context.SpeechProvider.md#startcontext)
- [stopContext](context.SpeechProvider.md#stopcontext)
- [toggleRecording](context.SpeechProvider.md#togglerecording)
- [switchApp](context.SpeechProvider.md#switchapp)
- [render](context.SpeechProvider.md#render)
- [componentDidUpdate](context.SpeechProvider.md#componentdidupdate)
- [componentWillUnmount](context.SpeechProvider.md#componentwillunmount)

## Constructors

### constructor

• **new SpeechProvider**(`props`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`SpeechProviderProps`](../interfaces/context.SpeechProviderProps.md) |

#### Overrides

React.Component&lt;SpeechProviderProps, SpeechProviderState\&gt;.constructor

## Methods

### componentDidMount

▸ `Readonly` **componentDidMount**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

React.Component.componentDidMount

___

### initialiseAudio

▸ `Readonly` **initialiseAudio**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### startContext

▸ `Readonly` **startContext**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### stopContext

▸ `Readonly` **stopContext**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### toggleRecording

▸ `Readonly` **toggleRecording**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

___

### switchApp

▸ `Readonly` **switchApp**(`appId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `appId` | `string` |

#### Returns

`Promise`<`void`\>

___

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.Component.render

___

### componentDidUpdate

▸ **componentDidUpdate**(`prevProps`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `prevProps` | [`SpeechProviderProps`](../interfaces/context.SpeechProviderProps.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

React.Component.componentDidUpdate

___

### componentWillUnmount

▸ **componentWillUnmount**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

React.Component.componentWillUnmount
