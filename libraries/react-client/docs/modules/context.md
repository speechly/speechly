[@speechly/react-client](../README.md) / context

# Module: context

## Table of contents

### Interfaces

- [SpeechContextState](../interfaces/context.SpeechContextState.md)
- [SpeechProviderProps](../interfaces/context.SpeechProviderProps.md)

### Type aliases

- [ContextFunc](context.md#contextfunc)

### Variables

- [SpeechContext](context.md#speechcontext)

### Classes

- [SpeechProvider](../classes/context.SpeechProvider.md)

## Type aliases

### ContextFunc

Ƭ **ContextFunc**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Signature for initialise and toggleRecording functions.

##### Returns

`Promise`<`void`\>

## Variables

### SpeechContext

• **SpeechContext**: `Context`<[`SpeechContextState`](../interfaces/context.SpeechContextState.md)\>

A React context that holds the state of Speechly SLU API client.
