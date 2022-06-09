[@speechly/react-ui](../README.md) / BigTranscript

# Module: BigTranscript

## Table of contents

### Type aliases

- [BigTranscriptProps](BigTranscript.md#bigtranscriptprops)

### Variables

- [BigTranscript](BigTranscript.md#bigtranscript)

## Type aliases

### BigTranscriptProps

Ƭ **BigTranscriptProps**: `Object`

Properties for BigTranscript component.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `placement?` | `string` | Optional "top" string turns on internal placement without any CSS positioning. |
| `formatText?` | `boolean` | Optional boolean. If true, transcript is formatted with detected entities, e.g. numbers. Default: true |
| `fontSize?` | `string` | Optional CSS string for text size. Default: "1.5rem" |
| `color?` | `string` | Optional string (CSS color) for text. Default: "#ffffff" |
| `highlightColor?` | `string` | Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5" |
| `backgroundColor?` | `string` | Optional string (CSS color) for hint text background. Default: "#202020" |
| `marginBottom?` | `string` | Optional string (CSS dimension). Dynamic margin added when element is visible. Default: "0rem" |
| `mockSegment?` | `SpeechSegment` | Optional SpeechSegment to be displayed instead of actual transcription from API. Can be used to demonstrate voice functionality to the user. |

## Variables

### BigTranscript

• `Const` **BigTranscript**: `React.FC`<[`BigTranscriptProps`](BigTranscript.md#bigtranscriptprops)\>

A React component that renders the transcript and entities received from Speechly SLU API.

The component is intended to be used for providing visual feedback to the speaker.
