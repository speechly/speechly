[@speechly/react-ui](../README.md) / hooks/useKeyboardEvent

# Module: hooks/useKeyboardEvent

## Table of contents

### Type aliases

- [KeyCallback](hooks_useKeyboardEvent.md#keycallback)

### Functions

- [useKeyboardEvent](hooks_useKeyboardEvent.md#usekeyboardevent)

## Type aliases

### KeyCallback

Ƭ **KeyCallback**: (`event`: `KeyboardEvent`) => `any`

#### Type declaration

▸ (`event`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `KeyboardEvent` |

##### Returns

`any`

#### Defined in

[hooks/useKeyboardEvent.ts:3](https://github.com/speechly/react-ui/blob/e631dfa/src/hooks/useKeyboardEvent.ts#L3)

## Functions

### useKeyboardEvent

▸ **useKeyboardEvent**(`keyDownCallback`, `keyUpCallBack`, `dependencies?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keyDownCallback` | [`KeyCallback`](hooks_useKeyboardEvent.md#keycallback) | `undefined` |
| `keyUpCallBack` | [`KeyCallback`](hooks_useKeyboardEvent.md#keycallback) | `undefined` |
| `dependencies` | `DependencyList` | `[]` |

#### Returns

`void`

#### Defined in

[hooks/useKeyboardEvent.ts:5](https://github.com/speechly/react-ui/blob/e631dfa/src/hooks/useKeyboardEvent.ts#L5)
