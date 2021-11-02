**[@speechly/react-client](../README.md)**

> [Globals](../README.md) / "index.d"

# Module: "index.d"

## Index

### Enumerations

* [SpeechState](../enums/_index_d_.speechstate.md)

### Classes

* [SpeechProvider](../classes/_index_d_.speechprovider.md)

### Interfaces

* [SpeechContextState](../interfaces/_index_d_.speechcontextstate.md)
* [SpeechProviderProps](../interfaces/_index_d_.speechproviderprops.md)

### Type aliases

* [ContextFunc](_index_d_.md#contextfunc)
* [SpeechEntity](_index_d_.md#speechentity)
* [SpeechIntent](_index_d_.md#speechintent)
* [SpeechTranscript](_index_d_.md#speechtranscript)
* [TentativeSpeechEntities](_index_d_.md#tentativespeechentities)
* [TentativeSpeechIntent](_index_d_.md#tentativespeechintent)
* [TentativeSpeechTranscript](_index_d_.md#tentativespeechtranscript)

### Variables

* [SpeechContext](_index_d_.md#speechcontext)

### Functions

* [useSpeechContext](_index_d_.md#usespeechcontext)

## Type aliases

### ContextFunc

Ƭ  **ContextFunc**: () => Promise\<void>

*Defined in dist/index.d.ts:14*

Signature for initialise and toggleRecording functions.

___

### SpeechEntity

Ƭ  **SpeechEntity**: { contextId: string ; entity: Entity ; segmentId: number  }

*Defined in dist/index.d.ts:88*

Wraps the final entity response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`entity` | Entity |
`segmentId` | number |

___

### SpeechIntent

Ƭ  **SpeechIntent**: { contextId: string ; intent: Intent ; segmentId: number  }

*Defined in dist/index.d.ts:98*

Wraps the final intent response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`intent` | Intent |
`segmentId` | number |

___

### SpeechTranscript

Ƭ  **SpeechTranscript**: { contextId: string ; segmentId: number ; word: Word  }

*Defined in dist/index.d.ts:203*

Wraps the final transcript response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`word` | Word |

___

### TentativeSpeechEntities

Ƭ  **TentativeSpeechEntities**: { contextId: string ; entities: Entity[] ; segmentId: number  }

*Defined in dist/index.d.ts:213*

Wraps the tentative entities response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`entities` | Entity[] |
`segmentId` | number |

___

### TentativeSpeechIntent

Ƭ  **TentativeSpeechIntent**: { contextId: string ; intent: Intent ; segmentId: number  }

*Defined in dist/index.d.ts:223*

Wraps the tentative intent response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`intent` | Intent |
`segmentId` | number |

___

### TentativeSpeechTranscript

Ƭ  **TentativeSpeechTranscript**: { contextId: string ; segmentId: number ; text: string ; words: Word[]  }

*Defined in dist/index.d.ts:233*

Wraps the tentative transcript response from the API.

#### Type declaration:

Name | Type |
------ | ------ |
`contextId` | string |
`segmentId` | number |
`text` | string |
`words` | Word[] |

## Variables

### SpeechContext

• `Const` **SpeechContext**: React_2.Context\<[SpeechContextState](../interfaces/_index_d_.speechcontextstate.md)>

*Defined in dist/index.d.ts:22*

A React context that holds the state of Speechly SLU API client.

## Functions

### useSpeechContext

▸ **useSpeechContext**(): [SpeechContextState](../interfaces/_index_d_.speechcontextstate.md)

*Defined in dist/index.d.ts:245*

React hook that exposes SpeechContext.
This is just an alias for useContext(SpeechContext).

**Returns:** [SpeechContextState](../interfaces/_index_d_.speechcontextstate.md)
