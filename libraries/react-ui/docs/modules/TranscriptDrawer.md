[@speechly/react-ui](../README.md) / TranscriptDrawer

# Module: TranscriptDrawer

## Table of contents

### Type aliases

- [TranscriptDrawerProps](TranscriptDrawer.md#transcriptdrawerprops)

### Variables

- [TranscriptDrawer](TranscriptDrawer.md#transcriptdrawer)

## Type aliases

### TranscriptDrawerProps

Ƭ **TranscriptDrawerProps**: `Object`

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
| `hint?` | `string` \| `string`[] | Optional hint text or array |
| `height?` | `string` | Optional minimum height as CSS string. Default: "8rem" |
| `smallTextColor?` | `string` | Optional string (CSS color) for hint text. Default: "#ffffff70" |
| `hintFontSize?` | `string` | Optional CSS string for hint text size. Default: "0.9rem" |

## Variables

### TranscriptDrawer

• `Const` **TranscriptDrawer**: `React.FC`<[`TranscriptDrawerProps`](TranscriptDrawer.md#transcriptdrawerprops)\>

A React component that renders the transcript and entities received from Speechly SLU API.

The component is intended to be used for providing visual feedback to the speaker.
