**[@speechly/react-client](../README.md)**

> [Globals](../README.md) / ["index.d"](../modules/_index_d_.md) / SpeechProvider

# Class: SpeechProvider

The provider for SpeechContext.

Make sure you have only one SpeechProvider in your application,
because otherwise the audio will be mixed up and unusable.

It is possible to switch the props on the fly, which will make provider stop current client if it's running
and start a new one.

## Hierarchy

* Component\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md), SpeechProviderState>

  ↳ **SpeechProvider**

## Index

### Constructors

* [constructor](_index_d_.speechprovider.md#constructor)

### Properties

* [context](_index_d_.speechprovider.md#context)
* [initialiseAudio](_index_d_.speechprovider.md#initialiseaudio)
* [props](_index_d_.speechprovider.md#props)
* [refs](_index_d_.speechprovider.md#refs)
* [state](_index_d_.speechprovider.md#state)
* [toggleRecording](_index_d_.speechprovider.md#togglerecording)
* [contextType](_index_d_.speechprovider.md#contexttype)

### Methods

* [UNSAFE\_componentWillMount](_index_d_.speechprovider.md#unsafe_componentwillmount)
* [UNSAFE\_componentWillReceiveProps](_index_d_.speechprovider.md#unsafe_componentwillreceiveprops)
* [UNSAFE\_componentWillUpdate](_index_d_.speechprovider.md#unsafe_componentwillupdate)
* [componentDidCatch](_index_d_.speechprovider.md#componentdidcatch)
* [componentDidMount](_index_d_.speechprovider.md#componentdidmount)
* [componentDidUpdate](_index_d_.speechprovider.md#componentdidupdate)
* [componentWillMount](_index_d_.speechprovider.md#componentwillmount)
* [componentWillReceiveProps](_index_d_.speechprovider.md#componentwillreceiveprops)
* [componentWillUnmount](_index_d_.speechprovider.md#componentwillunmount)
* [componentWillUpdate](_index_d_.speechprovider.md#componentwillupdate)
* [forceUpdate](_index_d_.speechprovider.md#forceupdate)
* [getSnapshotBeforeUpdate](_index_d_.speechprovider.md#getsnapshotbeforeupdate)
* [render](_index_d_.speechprovider.md#render)
* [setState](_index_d_.speechprovider.md#setstate)
* [shouldComponentUpdate](_index_d_.speechprovider.md#shouldcomponentupdate)

## Constructors

### constructor

\+ **new SpeechProvider**(`props`: [SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)): [SpeechProvider](_index_d_.speechprovider.md)

*Overrides void*

*Defined in dist/index.d.ts:114*

#### Parameters:

Name | Type |
------ | ------ |
`props` | [SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md) |

**Returns:** [SpeechProvider](_index_d_.speechprovider.md)

## Properties

### context

•  **context**: any

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[context](_index_d_.speechprovider.md#context)*

*Defined in node_modules/@types/react/index.d.ts:476*

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

**`see`** https://reactjs.org/docs/context.html

___

### initialiseAudio

• `Readonly` **initialiseAudio**: () => Promise\<void>

*Defined in dist/index.d.ts:116*

___

### props

• `Readonly` **props**: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> & Readonly\<{ children?: ReactNode  }>

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[props](_index_d_.speechprovider.md#props)*

*Defined in node_modules/@types/react/index.d.ts:501*

___

### refs

•  **refs**: { [key:string]: ReactInstance;  }

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[refs](_index_d_.speechprovider.md#refs)*

*Defined in node_modules/@types/react/index.d.ts:507*

**`deprecated`** 
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

___

### state

•  **state**: Readonly\<SpeechProviderState>

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[state](_index_d_.speechprovider.md#state)*

*Defined in node_modules/@types/react/index.d.ts:502*

___

### toggleRecording

• `Readonly` **toggleRecording**: () => Promise\<void>

*Defined in dist/index.d.ts:117*

___

### contextType

▪ `Static` `Optional` **contextType**: Context\<any>

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[contextType](_index_d_.speechprovider.md#contexttype)*

*Defined in node_modules/@types/react/index.d.ts:458*

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

**`see`** https://reactjs.org/docs/context.html#classcontexttype

## Methods

### UNSAFE\_componentWillMount

▸ `Optional`**UNSAFE_componentWillMount**(): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[UNSAFE_componentWillMount](_index_d_.speechprovider.md#unsafe_componentwillmount)*

*Defined in node_modules/@types/react/index.d.ts:712*

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** void

___

### UNSAFE\_componentWillReceiveProps

▸ `Optional`**UNSAFE_componentWillReceiveProps**(`nextProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `nextContext`: any): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[UNSAFE_componentWillReceiveProps](_index_d_.speechprovider.md#unsafe_componentwillreceiveprops)*

*Defined in node_modules/@types/react/index.d.ts:744*

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
------ | ------ |
`nextProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`nextContext` | any |

**Returns:** void

___

### UNSAFE\_componentWillUpdate

▸ `Optional`**UNSAFE_componentWillUpdate**(`nextProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `nextState`: Readonly\<SpeechProviderState>, `nextContext`: any): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[UNSAFE_componentWillUpdate](_index_d_.speechprovider.md#unsafe_componentwillupdate)*

*Defined in node_modules/@types/react/index.d.ts:772*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
------ | ------ |
`nextProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`nextState` | Readonly\<SpeechProviderState> |
`nextContext` | any |

**Returns:** void

___

### componentDidCatch

▸ `Optional`**componentDidCatch**(`error`: Error, `errorInfo`: ErrorInfo): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[componentDidCatch](_index_d_.speechprovider.md#componentdidcatch)*

*Defined in node_modules/@types/react/index.d.ts:641*

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters:

Name | Type |
------ | ------ |
`error` | Error |
`errorInfo` | ErrorInfo |

**Returns:** void

___

### componentDidMount

▸ `Optional`**componentDidMount**(): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[componentDidMount](_index_d_.speechprovider.md#componentdidmount)*

*Defined in node_modules/@types/react/index.d.ts:620*

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

**Returns:** void

___

### componentDidUpdate

▸ **componentDidUpdate**(`prevProps`: [SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)): Promise\<void>

*Overrides void*

*Defined in dist/index.d.ts:119*

#### Parameters:

Name | Type |
------ | ------ |
`prevProps` | [SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md) |

**Returns:** Promise\<void>

___

### componentWillMount

▸ `Optional`**componentWillMount**(): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[componentWillMount](_index_d_.speechprovider.md#componentwillmount)*

*Defined in node_modules/@types/react/index.d.ts:698*

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

**Returns:** void

___

### componentWillReceiveProps

▸ `Optional`**componentWillReceiveProps**(`nextProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `nextContext`: any): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[componentWillReceiveProps](_index_d_.speechprovider.md#componentwillreceiveprops)*

*Defined in node_modules/@types/react/index.d.ts:727*

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
------ | ------ |
`nextProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`nextContext` | any |

**Returns:** void

___

### componentWillUnmount

▸ **componentWillUnmount**(): Promise\<void>

*Overrides void*

*Defined in dist/index.d.ts:120*

**Returns:** Promise\<void>

___

### componentWillUpdate

▸ `Optional`**componentWillUpdate**(`nextProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `nextState`: Readonly\<SpeechProviderState>, `nextContext`: any): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[componentWillUpdate](_index_d_.speechprovider.md#componentwillupdate)*

*Defined in node_modules/@types/react/index.d.ts:757*

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters:

Name | Type |
------ | ------ |
`nextProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`nextState` | Readonly\<SpeechProviderState> |
`nextContext` | any |

**Returns:** void

___

### forceUpdate

▸ **forceUpdate**(`callback?`: undefined \| () => void): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[forceUpdate](_index_d_.speechprovider.md#forceupdate)*

*Defined in node_modules/@types/react/index.d.ts:493*

#### Parameters:

Name | Type |
------ | ------ |
`callback?` | undefined \| () => void |

**Returns:** void

___

### getSnapshotBeforeUpdate

▸ `Optional`**getSnapshotBeforeUpdate**(`prevProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `prevState`: Readonly\<SpeechProviderState>): any \| null

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[getSnapshotBeforeUpdate](_index_d_.speechprovider.md#getsnapshotbeforeupdate)*

*Defined in node_modules/@types/react/index.d.ts:677*

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters:

Name | Type |
------ | ------ |
`prevProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`prevState` | Readonly\<SpeechProviderState> |

**Returns:** any \| null

___

### render

▸ **render**(): Element

*Overrides void*

*Defined in dist/index.d.ts:118*

**Returns:** Element

___

### setState

▸ **setState**\<K>(`state`: (prevState: Readonly\<SpeechProviderState>,props: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>) => Pick\<SpeechProviderState, K> \| SpeechProviderState \| null \| Pick\<SpeechProviderState, K> \| SpeechProviderState \| null, `callback?`: undefined \| () => void): void

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[setState](_index_d_.speechprovider.md#setstate)*

*Defined in node_modules/@types/react/index.d.ts:488*

#### Type parameters:

Name | Type |
------ | ------ |
`K` | keyof SpeechProviderState |

#### Parameters:

Name | Type |
------ | ------ |
`state` | (prevState: Readonly\<SpeechProviderState>,props: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>) => Pick\<SpeechProviderState, K> \| SpeechProviderState \| null \| Pick\<SpeechProviderState, K> \| SpeechProviderState \| null |
`callback?` | undefined \| () => void |

**Returns:** void

___

### shouldComponentUpdate

▸ `Optional`**shouldComponentUpdate**(`nextProps`: Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)>, `nextState`: Readonly\<SpeechProviderState>, `nextContext`: any): boolean

*Inherited from [SpeechProvider](_index_d_.speechprovider.md).[shouldComponentUpdate](_index_d_.speechprovider.md#shouldcomponentupdate)*

*Defined in node_modules/@types/react/index.d.ts:631*

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters:

Name | Type |
------ | ------ |
`nextProps` | Readonly\<[SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)> |
`nextState` | Readonly\<SpeechProviderState> |
`nextContext` | any |

**Returns:** boolean
