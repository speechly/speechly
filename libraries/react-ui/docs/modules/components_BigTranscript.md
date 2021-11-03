[@speechly/react-ui](../README.md) / components/BigTranscript

# Module: components/BigTranscript

## Table of contents

### Type aliases

- [BigTranscriptProps](components_BigTranscript.md#bigtranscriptprops)

### Variables

- [BigTranscript](components_BigTranscript.md#bigtranscript)

## Type aliases

### BigTranscriptProps

Ƭ **BigTranscriptProps**: `Object`

Properties for BigTranscript component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backgroundColor?` | `string` | Optional string (CSS color) for hint text background. Default: "#202020" |
| `color?` | `string` | Optional string (CSS color) for text. Default: "#ffffff" |
| `fontSize?` | `string` | Optional CSS string for text size. Default: "1.5rem" |
| `formatText?` | `boolean` | Optional boolean. If true, transcript is formatted with detected entities, e.g. numbers. Default: true |
| `highlightColor?` | `string` | Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5" |
| `marginBottom?` | `string` | Optional string (CSS dimension). Dynamic margin added when element is visible. Default: "0rem" |
| `mockSegment?` | `SpeechSegment` | Optional SpeechSegment to be displayed instead of actual transcription from API. Can be used to demonstrate voice functionality to the user. |
| `placement?` | `string` | Optional "top" string turns on internal placement without any CSS positioning. |

#### Defined in

[components/BigTranscript.tsx:20](https://github.com/speechly/react-ui/blob/e631dfa/src/components/BigTranscript.tsx#L20)

## Variables

### BigTranscript

• **BigTranscript**: `React.FC`<[`BigTranscriptProps`](components_BigTranscript.md#bigtranscriptprops)\>

A React component that renders the transcript and entities received from Speechly SLU API.

The component is intended to be used for providing visual feedback to the speaker.

#### Defined in

[components/BigTranscript.tsx:62](https://github.com/speechly/react-ui/blob/e631dfa/src/components/BigTranscript.tsx#L62)
